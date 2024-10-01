from flask import Flask
from flask_cors import CORS
from db.cloud_db import CloudDB
from api import *

app = Flask(__name__)
CORS(app)  # Enable CORS
app.register_blueprint(api_equipment)  # Register the equipment API blueprint
app.register_blueprint(api_case)  # Register the case API blueprint
app.register_blueprint(api_mock)  # Register the mock API blueprint


@app.route("/")
def public():
    return "Hello, World!"


@app.route("/cloud-db")
def test_cloud_db():
    with CloudDB() as cursor:
        cursor.execute("SELECT 1 + 1 AS result")
        result = cursor.fetchone()[0]

    return str(result)


if __name__ == "__main__":
    app.run()
