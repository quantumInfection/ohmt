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
    company_id = "16edda9a-299f-4ab4-a41c-922e637cad31"

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
    company_id = "16edda9a-299f-4ab4-a41c-922e637cad31"
    _uow = suow.DbPoolUnitOfWork()

    cases = reads.get_company_cases(_uow, company_id)
    equipments = reads.get_company_equipments(_uow, company_id)
    locations = reads.get_company_locations(_uow, company_id)

    cases = list(cases.values())

    for case in cases:
        case["equipments"] = []
        for equipment in equipments:
            if equipment["case_id"] == case["id"]:
                case["equipments"].append(equipment)
        case["equipments"].sort(key=lambda x: x["created_at"])

    return {
        "cases": cases,
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
