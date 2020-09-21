from flask import jsonify, Blueprint, abort, request
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
import itertools
import bcrypt
import base64
import math
from bitarray import bitarray

from models import db, Meeting, Entry
import schemas
from util import create_user

blueprint = Blueprint('guest', __name__)

def binary_string(b: bytes):
    s = bitarray()
    s.frombytes(b)
    return s.to01()

def login(meeting_id, name, password):
    """
    Attempts to log in a user with the name and password, returns an entry object if the user
    exists else return None.
    """
    entry = Entry.query.filter_by(
        meeting_id=meeting_id,
        name=name
    ).first()

    if entry and entry.password == "" and password == "":
        # no password
        return entry
    elif entry and entry.password == "" and password != "":
        abort(401)
    elif entry and entry.password != "":
        # with password, verify first
        if bcrypt.checkpw(password.encode("ascii"), entry.password.encode("ascii")):
            return entry
    
    return None

@blueprint.route('/<_id>/auth', methods=['POST'])
def post_login(_id):
    """
    Attempts to perform a login with the specified credentials, and return the user's current
    schedule. If an unknown username is specified and allow_registration is true, a new user
    is created.
    """

    class Validator(Inputs):
        json = [JsonSchema(schema=schemas.guest_auth)]
    inputs = Validator(request)
    if not inputs.validate():
        return jsonify(success=False, error=inputs.errors)

    res = Meeting.query.filter_by(guest_key=_id).first()
    if res == None:
        abort(404)

    # calculate number of slots
    if res.options["type"] == "day":
        n_slots = (res.options["max_time"] - res.options["min_time"]) * res.options["days"].count("1")
    elif res.options["type"] == "date":
        n_slots = (res.options["max_time"] - res.options["min_time"]) * len(res.options["dates"])
    else:
        abort(500)
    
    entry = login(res.id, request.json["auth"]["name"], request.json["auth"]["password"])

    if entry:
        return jsonify(
            success=True, 
            data={
                "schedule": binary_string(entry.availability)[:n_slots], 
                "notes": entry.notes
            }
        )
    elif not entry and res.allow_registration:
        # return an empty schedule and notes, but don't create the schedule just yet
        return jsonify(success=True, data={"schedule": "", "notes": ""})

    # credentials are invalid and/or allow_registration is set to false
    abort(401)



@blueprint.route('/<_id>', methods=['GET'])
def get_meeting(_id):
    """
    Retrieves the schedule metadata + schedule. Only return certain options based on the privacy
    setting.
    """

    res = Meeting.query.filter_by(guest_key=_id).first()
    if res == None:
        abort(404)

    # calculate number of slots
    if res.options["type"] == "day":
        n_slots = (res.options["max_time"] - res.options["min_time"]) * res.options["days"].count("1")
    elif res.options["type"] == "date":
        n_slots = (res.options["max_time"] - res.options["min_time"]) * len(res.options["dates"])
    else:
        abort(500)

    if not res.private:
        entries = Entry.query.filter_by(meeting_id=res.id).all()
        schedules = { i.name: binary_string(i.availability)[:n_slots] for i in entries }
        notes = { i.name: i.notes for i in entries }
    else:
        schedules = {}
        notes = {}

    return jsonify(
        success=True,
        data={
            "name": res.name,
            "guest_key": res.guest_key,
            "location": res.location,
            "private": res.private,
            "allow_registration": res.allow_registration,
            "options": res.options,
            "schedules": schedules,
            "notes": notes
        }
    )

@blueprint.route('/<_id>/ics', methods=['GET'])
def get_ics(_id):
    """
    TODO: Returns an ICS of the meeting.
    """

    pass

@blueprint.route('/<_id>/schedule', methods=['POST'])
def update_schedule(_id):
    """
    Updates the current user's schedule.
    """

    class Validator(Inputs):
        json = [JsonSchema(schema=schemas.guest_entry)]
    inputs = Validator(request)
    if not inputs.validate():
        return jsonify(success=False, error=inputs.errors)
    
    res = Meeting.query.filter_by(guest_key=_id).first()
    if res == None:
        abort(404)
    
    # calculate number of slots
    if res.options["type"] == "day":
        n_slots = (res.options["max_time"] - res.options["min_time"]) * res.options["days"].count("1")
    elif res.options["type"] == "date":
        n_slots = (res.options["max_time"] - res.options["min_time"]) * len(res.options["dates"])
    else:
        abort(500)

    entry = login(res.id, request.json["auth"]["name"], request.json["auth"]["password"])
    if not entry:
        entry = create_user(res.id, request.json["auth"]["name"], request.json["auth"]["password"])
        db.session.add(entry)

    # initialise bitfield to record dates
    data = request.json["entry"]
    if len(data) != n_slots:
        jsonify(success=False, error="invalid number of slots")

    slots = bitarray(data, endian="big")
    entry.availability = slots.tobytes()
    db.session.commit()
    
    return jsonify(success=True)

@blueprint.route('/<_id>/notes', methods=['POST'])
def update_notes(_id):
    """
    Updates the current user's notes.
    """

    class Validator(Inputs):
        json = [JsonSchema(schema=schemas.guest_notes)]
    inputs = Validator(request)
    if not inputs.validate():
        return jsonify(success=False, error=inputs.errors)
    
    res = Meeting.query.filter_by(guest_key=_id).first()
    if res == None:
        abort(404)
    
    entry = login(res.id, request.json["auth"]["name"], request.json["auth"]["password"])
    if not entry:
        entry = create_user(res.id, request.json["auth"]["name"], request.json["auth"]["password"])
    
    entry.notes = request.json["notes"]
    db.session.commit()
    return jsonify(success=True)