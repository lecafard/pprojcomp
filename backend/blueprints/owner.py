from flask import jsonify, Blueprint, request
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
import secrets
import json

from models import db, Meeting
import schemas


blueprint = Blueprint('owner', __name__)

# will impose arbitrary limit of 1344 slots (168 bytes)
# however max days already 30
MAX_SLOTS = 1344

@blueprint.route('/new', methods=['POST'])
def new_schedule():
    """
    Creates a new schedule.
    """

    class Validator(Inputs):
        json = [JsonSchema(schema=schemas.meeting)]
    inputs = Validator(request)
    
    if not inputs.validate():
        return jsonify(success=False, error=inputs.errors)
    
    # additional validation for the options
    options = request.json["options"]
    if options["minTime"] >= options["maxTime"]:
        return jsonify(success=False, error="minTime is greater than maxTime")
    if options["type"] == "dates":
        try:
            options["dates"] = list(set(options["dates"]))
            options["dates"].sort()
            if len(options["dates"]) * (options["maxTime"] - options["minTime"]) > MAX_SLOTS:
                return jsonify(success=False, error="too many timeslots")    
        except ValueError:
            return jsonify(success=False, error="invalid dates provided")
    

    owner_key = secrets.token_urlsafe(12)
    guest_key = secrets.token_urlsafe(12)
    meeting = Meeting(
        owner_key=owner_key,
        guest_key=guest_key,
        name=request.json["name"],
        location=request.json["location"],
        private=request.json["private"],
        allow_registration=request.json["allow_registration"],
        options={})
    
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

@blueprint.route('/<_id>/create_users', methods=['POST'])
def create_users(_id):
    """
    Allows an admin to pre-create users (not MVP).
    """
    return jsonify({"message": "not implemented"}), 501

@blueprint.route('/<_id>/schedule', methods=['GET'])
def get_schedule(_id):
    """
    Gets the overlaid schedules.
    """
    return jsonify(
        success=True,
        data={
            "stub1": "010001",
            "stub2": "100001"
        }
    )

@blueprint.route('/<_id>/options', methods=['GET'])
def get_options(_id):
    """
    Retrieves the schedule metadata.
    """
    return jsonify({"message": "current schedule"})

@blueprint.route('/<_id>/options', methods=['POST'])
def update_options(_id):
    """
    Updates the schedule metadata, only certain fields such as privacy and name can be updated.
    """
    return jsonify({"message": "current schedule"})