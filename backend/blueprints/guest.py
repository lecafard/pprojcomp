from flask import jsonify, Blueprint

blueprint = Blueprint('guest', __name__)

@blueprint.route('/:id/login', methods=['POST'])
def login():
    """
    Verifies the username (and optional password) and allows user to log in. Returns an opaque
    access token, which will be verified on subsequent requests to schedule.
    """
    return jsonify({"message": "new schedule"})

@blueprint.route('/:id/schedule', methods=['GET'])
def get_schedule():
    """
    Retrieves the schedule. Returns an error if the schedule is set to private.
    """
    return jsonify({"message": "current schedule"})

@blueprint.route('/:id/options', methods=['GET'])
def get_options():
    """
    Retrieves the schedule metadata. Only return certain options based on the privacy setting.
    """
    return jsonify({"message": "current schedule"})

@blueprint.route('/:id/schedule', methods=['POST'])
def update_schedule():
    """
    Updates the current user's schedule.
    """
    return jsonify({"message": "updated schedule"})

@blueprint.route('/:id/notes', methods=['GET'])
def update_notes():
    """
    Get the current user's notes.
    """
    return jsonify({"message": "current notes"})

@blueprint.route('/:id/notes', methods=['POST'])
def update_notes():
    """
    Updates the current user's notes.
    """
    return jsonify({"message": "updated notes"})