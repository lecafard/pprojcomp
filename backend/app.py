from flask import Flask, jsonify
from flask_jsonschema_validator import JSONSchemaValidator

import config
from connections.sql import db

from blueprints.owner import blueprint as owner
from blueprints.guest import blueprint as guest

app = Flask(__name__)
JSONSchemaValidator(app=app, root="schemas")
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = config.POSTGRES_CONNECTION
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

# register blueprints
app.register_blueprint(owner, url_prefix='/owner')
app.register_blueprint(guest, url_prefix='/guest')

@app.errorhandler(404)
def page_not_found(e):
    # note that we set the 404 status explicitly
    return jsonify({"error": "NotFound"}), 404

@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"error": "MethodNotAllowed"}), 405

@app.errorhandler(401)
def method_not_allowed(e):
    return jsonify({"error": "Unauthorized"}), 401