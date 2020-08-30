from flask import Flask, jsonify
from blueprints.owner import blueprint as owner
from blueprints.guest import blueprint as guest

app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

# TODO: connect to database


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