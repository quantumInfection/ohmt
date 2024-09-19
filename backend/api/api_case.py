from flask import blueprints, request

app = blueprints.Blueprint("api_case", __name__, url_prefix="/v1/case")
import services.case.commands as case_commands
import services.unit_of_work as suow
import logging


@app.route("/", methods=["POST"])
def create_case():
    """
    Create case

    args:
        case_id: str
        company_id: str
        name: str
        location_id: str
    """
    args = request.get_json()

    # Create case
    case = case_commands.create_case(
        suow.DbPoolUnitOfWork(),
        args["case_id"],
        args["company_id"],
        args["name"],
        args["location_id"],
    )

    return case.__dict__


@app.route("/<case_id>", methods=["PUT"])
def update_case_location(case_id):
    """
    Update case location

    args:
        location_id: str
    """
    args = request.get_json()

    # Update case location
    case = case_commands.update_case_location(
        suow.DbPoolUnitOfWork(),
        case_id,
        args["location_id"],
    )

    return case.__dict__


@app.route("/<case_id>", methods=["GET"])
def get_case(case_id):
    """
    Get case
    """
    # case = case_commands.get_case(
    #     suow.DbPoolUnitOfWork(),
    #     case_id,
    # )

    pass
