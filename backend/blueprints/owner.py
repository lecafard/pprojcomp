from flask import jsonify, Blueprint

blueprint = Blueprint('owner', __name__)

@blueprint.route('/')
def hello_world():
    return jsonify({"message": "Hello, World"})

@blueprint.route('/new', methods=['POST'])
def new_schedule():
    """
    Createa a new schedule.
    """
    return jsonify({"message": "new schedule"})

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