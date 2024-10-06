from flask import blueprints

import json

app = blueprints.Blueprint("api_mock", __name__, url_prefix="/v1/mock")


@app.route("/cases", methods=["GET"])
def get_cases():
    """
    Get mock cases
    """
    return json.dumps({
        "cases": [
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
        ], "locations": [
            {
                "id": 1,
                "name": "New York"
            },
            {
                "id": 2,
                "name": "Los Angeles"
            },
            {
                "id": 3,
                "name": "Chicago"
            }
        ]
    })


@app.route("/equipments", methods=["GET"])
def get_equipments():
    """
    Get mock equipments
    """
    return json.dumps({
        "equipments": [
            {
                "id": 1,
                "name": "Equipment A",
                "status_label": "Active",
                "location": "Warehouse 1",
                "case_id": "C123",
                "calibration_due_label": "30 days",
                "calibration_bg": "#FFEB3B",
                "calibration_fg": "#000000"
            },
            {
                "id": 2,
                "name": "Equipment B",
                "status_label": "Repair",
                "location": "Warehouse 2",
                "case_id": "C124",
                "calibration_due_label": "45 days",
                "calibration_bg": "#F44336",
                "calibration_fg": "#FFFFFF"
            },
            {
                "id": 3,
                "name": "Equipment C",
                "status_label": "Calibration",
                "location": "Warehouse 3",
                "case_id": "C125",
                "calibration_due_label": "60 days",
                "calibration_bg": "#4CAF50",
                "calibration_fg": "#FFFFFF"
            },
            {
                "id": 4,
                "name": "Equipment C",
                "status_label": "Maintenance",
                "location": "Warehouse 3",
                "case_id": "C125",
                "calibration_due_label": "NA",
                "calibration_bg": "#4CAF50",
                "calibration_fg": "#FFFFFF"
            }
        ]
    })
