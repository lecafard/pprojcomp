from flask import jsonify, Blueprint, request
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
import secrets
import json

from models import db, Meeting
import schemas


blueprint = Blueprint('owner', __name__)

@blueprint.route('/')
def hello_world():
    return jsonify({"message": "Hello, World"})





@blueprint.route('/new', methods=['POST'])
def new_schedule():
    """
    Creates a new schedule.
    """

    class Validator(Inputs):
        json = [JsonSchema(schema=schemas.meeting)]
    inputs = Validator(request)
    
    if not inputs.validate():
        return jsonify(success=False, errors=inputs.errors)

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

    return jsonify({
        "name": meeting.name,
        "location": meeting.location,
        "private": meeting.private,
        "allow_registration": meeting.allow_registration,
        "owner_key": meeting.owner_key,
        "guest_key": meeting.guest_key,
        "options": meeting.options
    })

@blueprint.route('/:id/create_users', methods=['POST'])
def create_users():
    """
    Allows an admin to pre-create users (not MVP).
    """
    return jsonify({"message": "new schedule"})

@blueprint.route('/:id/schedule', methods=['GET'])
def get_schedule():
    """
    Gets the current schedule metadata + schedule.
    """
    return jsonify({"message": "current schedule"})

@blueprint.route('/:id/options', methods=['GET'])
def get_options():
    """
    Retrieves the schedule metadata.
    """
    return jsonify({"message": "current schedule"})

@blueprint.route('/:id/options', methods=['POST'])
def update_options():
    """
    Updates the schedule metadata, only certain fields such as privacy and name can be updated.
    """
    return jsonify({"message": "current schedule"})