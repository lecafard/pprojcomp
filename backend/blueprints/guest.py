from flask import jsonify, Blueprint, abort, request
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
import itertools
import bcrypt

from models import db, Meeting, Entry
from models import db, Meeting
import schemas

blueprint = Blueprint('guest', __name__)

def create_user(name, password, schedule=[], notes=""):
    digest = ""
    if password:
        # hash the digest
        digest = bcrypt.hashpw(
            password.encode("ascii"),
            bcrypt.gensalt()
        ).decode("ascii")
    
    # create new entry
    entry = Entry(
        meeting_id=res.id,
        name=name,
        password=digest,
        schedule=[],
        notes=""
    )
    db.session.add(entry)
    db.session.commit()

@blueprint.route('/<_id>/auth', methods=['POST'])
def login(_id):
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
    
    entry = Entry.query.filter_by(
        meeting_id=res.id,
        name=request.json["auth"]["name"]
    ).first()

    if entry and entry.password == "" and request.json["auth"]["password"] == "":
        # no password
        return jsonify({"schedule": entry.schedule, "notes": entry.notes})
    elif entry and entry.password != "":
        # with password, verify first
        if bcrypt.checkpw(
            request.json["auth"]["password"].encode("ascii"),
            entry.password.encode("ascii")):
        
            return jsonify({"availability": entry.availability, "notes": entry.notes})
    elif not entry and res.allow_registration:
        # return an empty schedule and notes, but don't create the schedule just yet
        return jsonify({"availability": "", "notes": ""})

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
        schedules = { i.name: i.schedule for i in entries }
        notes = { i.name: i.notes for i in entries }
    else:
        schedules = {}
        notes = {}

    return jsonify({
        "name": res.name,
        "location": res.location,
        "private": res.private,
        "allow_registration": res.allow_registration,
        "options": res.options,
        "schedules": schedules,
        "notes": notes
    })

@blueprint.route('/<_id>/schedule', methods=['POST'])
def update_schedule():
    """
    Updates the current user's schedule.
    """

    res = Meeting.query.filter_by(guest_key=_id).first()
    if res == None:
        abort(404)
    
    # TODO: return updated schedule and also use create_user() if user does not exist and opts allow
    return jsonify({"message": "updated schedule"})

@blueprint.route('/<_id>/notes', methods=['POST'])
def update_notes():
    """
    Updates the current user's notes.
    """

    res = Meeting.query.filter_by(guest_key=_id).first()
    if res == None:
        abort(404)
    
    # TODO
    return jsonify({"status": True})