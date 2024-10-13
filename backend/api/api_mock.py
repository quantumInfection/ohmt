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
    Get mock data required for equipments tab.
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
        ],
        "locations": [
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
        ],
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
        ],
        "categories": [
            {
                "id": "2cc45b02-c9a5-4098-b122-579913168173",
                "name": "Dust"
            },
            {
                "id": "8e632bc1-7a9b-4c04-935a-ffa84c55af62",
                "name": "Gas"
            },
            {
                "id": "e4a2395d-9f1e-4449-b420-d33417dd1ca3",
                "name": "Heat"
            },
            {
                "id": "11d52bb6-8d95-46e4-82af-357b0982c8c0",
                "name": "IAQ"
            },
            {
                "id": "635fafc6-f0df-48a1-9f16-538fa898387c",
                "name": "Laboratory"
            },
            {
                "id": "69711045-87bb-4ae5-8c19-65b3bef514f8",
                "name": "Lighting"
            },
            {
                "id": "e7cb2878-ee04-4385-9df5-56072e277656",
                "name": "Noise"
            },
            {
                "id": "3ca892b7-4de2-4586-97e7-f3c1abd132b9",
                "name": "Other"
            },
            {
                "id": "409a36e7-1a6a-41b4-84e6-57e78c82ed9e",
                "name": "Vibration"
            }
        ],
        "calibration_categories": [
            "Nil Calibration",
            "Conformance",
            "Normal Calibration",
            "IANZ/NATA Calibration"
        ]
    })
