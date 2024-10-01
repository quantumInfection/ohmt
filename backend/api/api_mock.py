from flask import blueprints

import json

app = blueprints.Blueprint("api_mock", __name__, url_prefix="/v1/mock")


@app.route("/cases", methods=["GET"])
def get_cases():
    """
    Get mock cases
    """
    return json.dumps([
        {
            "id": 1,
            "name": "John Doe",
            "location": "New York"
        },
        {
            "id": 2,
            "name": "Jane Smith",
            "location": "Los Angeles"
        },
        {
            "id": 3,
            "name": "Alice Johnson",
            "location": "Chicago"
        }
    ])
