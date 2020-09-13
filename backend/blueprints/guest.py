from flask import jsonify, Blueprint, abort, request
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
import itertools
import bcrypt
import base64
import math
from bitarray import bitarray

from models import db, Meeting, Entry
from models import db, Meeting
import schemas

blueprint = Blueprint('guest', __name__)

def create_user(meeting_id, name, password, schedule=[], notes=""):
    digest = ""
    if password:
        # hash the digest
        digest = bcrypt.hashpw(
            password.encode("ascii"),
            bcrypt.gensalt()
        ).decode("ascii")
    
    # create new entry
    entry = Entry(
        meeting_id=meeting_id,
        name=name,
        password=digest,
        availability=b"",
        notes=""
    )
    return entry


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
        return jsonify(success=False, errors=inputs.errors)

    res = Meeting.query.filter_by(guest_key=_id).first()
    if res == None:
        abort(404)
    
    entry = login(res.id, request.json["auth"]["name"], request.json["auth"]["password"])

    if entry:
        return jsonify(
            success=True, 
            data={
                "schedule": base64.b64encode(entry.availability).decode("ascii"), 
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

    if not res.private:
        entries = Entry.query.filter_by(meeting_id=res.id).all()
        schedules = { i.name: base64.b64encode(i.availability).decode("ascii") for i in entries }
        notes = { i.name: i.notes for i in entries }
    else:
        schedules = {}
        notes = {}

    return jsonify(
        success=True,
        data={
            "name": res.name,
            "location": res.location,
            "private": res.private,
            "allow_registration": res.allow_registration,
            "options": res.options,
            "schedules": schedules,
            "notes": notes
        }
    )

@blueprint.route('/<_id>/schedule', methods=['POST'])
def update_schedule(_id):
    """
    Updates the current user's schedule.
    """

    class Validator(Inputs):
        json = [JsonSchema(schema=schemas.guest_entry)]
    inputs = Validator(request)
    if not inputs.validate():
        return jsonify(success=False, errors=inputs.errors)
    
    res = Meeting.query.filter_by(guest_key=_id).first()
    if res == None:
        abort(404)
    
    # calculate number of slots
    if res.options["type"] == "day":
        n_slots = (res.options["maxTime"] - res.options["minTime"]) * res.options["days"].count("1")
    elif res.options["type"] == "date":
        n_slots = (res.options["maxTime"] - res.options["minTime"]) * len(res.options["dates"])
    else:
        abort(500)

    entry = login(res.id, request.json["auth"]["name"], request.json["auth"]["password"])
    if not entry:
        entry = create_user(res.id, request.json["auth"]["name"], request.json["auth"]["password"])
        db.session.add(entry)

    data = request.json["entry"]
    if data["from"] > data["to"] or data["to"] > n_slots:
        return jsonify(success=False, error="invalid entry"), 400

    if entry.availability == b"":
        slots = bitarray("0" * n_slots, endian="big")
    else:
        slots = bitarray(endian="big")
        slots.frombytes(entry.availability)
    
    slots[data["from"]:data["to"]] = data["state"]
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
        return jsonify(success=False, errors=inputs.errors)
    
    res = Meeting.query.filter_by(guest_key=_id).first()
    if res == None:
        abort(404)
    
    entry = login(res.id, request.json["auth"]["name"], request.json["auth"]["password"])
    if not entry:
        entry = create_user(res.id, request.json["auth"]["name"], request.json["auth"]["password"])
        db.session.add(entry)
    
    entry.notes = request.json["notes"]
    db.session.commit()
    return jsonify(success=True)