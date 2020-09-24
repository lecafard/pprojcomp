from flask import jsonify, Blueprint, request, abort
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
import secrets
import json
import base64
from bitarray import bitarray

from util import create_user
from models import db, Meeting, Entry
import schemas


blueprint = Blueprint('owner', __name__)

# will impose arbitrary limit of 1344 slots (168 bytes)
# however max days already 30
MAX_SLOTS = 1344

def binary_string(b: bytes):
    s = bitarray()
    s.frombytes(b)
    return s.to01()

@blueprint.route('/new', methods=['POST'])
def new_schedule():
    """
    Creates a new schedule.
    """

    class Validator(Inputs):
        json = [JsonSchema(schema=schemas.meeting)]
    inputs = Validator(request)
    
    if not inputs.validate():
        return jsonify(success=False, error=inputs.errors), 400
    
    # additional validation for the options
    if "options" not in request.json:
        return json(success=False, error="options is a required property"), 400
    
    options = request.json["options"]
    if options["min_time"] >= options["max_time"]:
        return jsonify(success=False, error="min_time is greater than max_time"), 400
    if options["type"] == "day":
        if options["days"].count("1") == 0:
            return jsonify(success=False, error="at least one day must be selected"), 400
    if options["type"] == "date":
        try:
            options["dates"] = list(set(options["dates"]))
            options["dates"].sort()
            if len(options["dates"]) * (options["max_time"] - options["min_time"]) > MAX_SLOTS:
                return jsonify(success=False, error="too many timeslots"), 400
        except ValueError:
            return jsonify(success=False, error="invalid dates provided"), 400
    

    owner_key = secrets.token_urlsafe(12)
    guest_key = secrets.token_urlsafe(12)
    meeting = Meeting(
        owner_key=owner_key,
        guest_key=guest_key,
        name=request.json["name"],
        location=request.json["location"],
        private=request.json["private"],
        allow_registration=request.json["allow_registration"],
        options=options)
    
    db.session.add(meeting)
    db.session.commit()

    return jsonify(
        success=True,
        data={
            "name": meeting.name,
            "location": meeting.location,
            "private": meeting.private,
            "allow_registration": meeting.allow_registration,
            "owner_key": meeting.owner_key,
            "guest_key": meeting.guest_key,
            "options": meeting.options
        }
    )

@blueprint.route('/<_id>/delete_user', methods=['POST'])
def delete_user(_id):
    """
    Delete a user.
    """
    class Validator(Inputs):
        json = [JsonSchema(schema=schemas.admin_delete)]
    inputs = Validator(request)
    
    if not inputs.validate():
        return jsonify(success=False, error=inputs.errors), 400

    res = Meeting.query.filter_by(owner_key=_id).first()
    if res == None:
        abort(404)
    
    entry = Entry.query.filter_by(meeting_id=res.id, name=request.json["name"]).first()
    if not entry:
        return jsonify(success=False, error="user not found"), 400

    db.session.delete(entry)
    db.session.commit()
    
    return jsonify(success=True)


@blueprint.route('/<_id>/ics', methods=['GET'])
def get_ics(_id):
    """
    TODO: Returns an ICS of the meeting.
    """
    
    pass


@blueprint.route('/<_id>/create_user', methods=['POST'])
def post_create_user(_id):
    """
    Create a user.
    """

    class Validator(Inputs):
        json = [JsonSchema(schema=schemas.auth)]
    inputs = Validator(request)

    if not inputs.validate():
        return jsonify(success=False, error=inputs.errors), 400

    res = Meeting.query.filter_by(owner_key=_id).first()
    if res == None:
        abort(404)

    if request.json["name"] == "(me)":
        return jsonify(success=False, error="name not allowed"), 400
    
    entry = Entry.query.filter_by(meeting_id=res.id, name=request.json["name"]).first()
    if entry:
        return jsonify(success=False, error="user exists"), 400
    
    create_user(res.id, request.json["name"], request.json["password"])
    db.session.commit()
    
    return jsonify(success=True)

@blueprint.route('/<_id>', methods=['GET'])
def get_meeting(_id):
    """
    Retrieves the schedule metadata + schedule. Only return certain options based on the privacy
    setting.
    """

    res = Meeting.query.filter_by(owner_key=_id).first()
    if res == None:
        abort(404)

    # calculate number of slots
    if res.options["type"] == "day":
        n_slots = (res.options["max_time"] - res.options["min_time"]) * res.options["days"].count("1")
    elif res.options["type"] == "date":
        n_slots = (res.options["max_time"] - res.options["min_time"]) * len(res.options["dates"])
    else:
        abort(500)

    entries = Entry.query.filter_by(meeting_id=res.id).all()
    schedules = { i.name: binary_string(i.availability)[:n_slots] for i in entries }
    notes = { i.name: i.notes for i in entries }


    return jsonify(
        success=True,
        data={
            "name": res.name,
            "location": res.location,
            "private": res.private,
            "allow_registration": res.allow_registration,
            "guest_key": res.guest_key,
            "options": res.options,
            "schedules": schedules,
            "notes": notes
        }
    )

@blueprint.route('/<_id>', methods=['POST'])
def update_options(_id):
    """
    Updates the schedule metadata, ignores updates to options.
    """

    res = Meeting.query.filter_by(owner_key=_id).first()
    if res == None:
        abort(404)

    class Validator(Inputs):
        json = [JsonSchema(schema=schemas.meeting)]
    inputs = Validator(request)
    
    if not inputs.validate():
        return jsonify(success=False, error=inputs.errors), 400
    
    res.name = request.json["name"]
    res.location = request.json["location"]
    res.allow_registration = request.json["allow_registration"]
    res.private = request.json["private"]
    db.session.commit()
    return jsonify(success=True)