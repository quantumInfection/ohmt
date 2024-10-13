from flask import blueprints, request

import services.case.commands as case_commands
import services.reads as reads
import services.unit_of_work as suow

app = blueprints.Blueprint("api_case", __name__, url_prefix="/v1/cases")


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
    company_id = '16edda9a-299f-4ab4-a41c-922e637cad31'

    # Create case
    case = case_commands.create_case(
        suow.DbPoolUnitOfWork(),
        args["case_id"],
        company_id,  # TODO: Replace using auth
        args["name"],
        args["location_id"],
    )

    return case.__dict__


@app.route("/", methods=["GET"])
def get_all_cases():
    """
    Get all cases
    """
    company_id = '16edda9a-299f-4ab4-a41c-922e637cad31'

    cases = reads.get_company_cases(suow.DbPoolUnitOfWork(), company_id)
    locations = reads.get_company_locations(suow.DbPoolUnitOfWork(), company_id)

    return {
        "cases": list(cases.values()),
        "locations": list(locations.values()),
    }


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
