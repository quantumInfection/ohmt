from flask import blueprints, request

import services.case.commands as case_commands
import services.reads as reads
import services.unit_of_work as suow
import view.view as view

import auth

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
@auth.supabase
def get_all_cases():
    """
    Get all cases
    """
    company_id = "16edda9a-299f-4ab4-a41c-922e637cad31"
    _uow = suow.DbPoolUnitOfWork()

    cases_lookup = reads.get_company_cases(_uow, company_id)
    equipments = reads.get_company_equipments(_uow, company_id)
    locations = reads.get_company_locations(_uow, company_id)
    calibration_providers = reads.get_calibration_providers(_uow)
    categories = reads.get_company_categories(_uow, company_id)
    categories_lookup = {c["id"]: c for c in categories}

    cases = list(cases_lookup.values())

    for case in cases:
        case["equipments"] = []
        for equipment in equipments:
            if equipment["case_id"] == case["id"]:
                case["equipments"].append(
                    view.make_equipment(
                        equipment,
                        locations,
                        cases_lookup,
                        calibration_providers,
                        categories_lookup,
                    )
                )

    return {
        "cases": cases,
        "locations": list(locations.values()),
    }


@app.route("/<case_id>", methods=["GET"])
@auth.supabase
def get_case(case_id):
    """
    Get case

    args:
        case_id: str
    """
    company_id = "16edda9a-299f-4ab4-a41c-922e637cad31"
    _uow = suow.DbPoolUnitOfWork()

    calibration_providers = reads.get_calibration_providers(_uow)
    locations = reads.get_company_locations(_uow, company_id)
    categories = reads.get_company_categories(_uow, company_id)
    categories_lookup = {c["id"]: c for c in categories}
    cases = reads.get_company_cases(_uow, company_id)
    equipments = reads.get_company_equipments(_uow, company_id)

    case = next(c for c in cases.values() if c["id"] == case_id)

    case["equipments"] = [
        view.make_equipment(
            e, locations, cases, calibration_providers, categories_lookup
        )
        for e in equipments
        if e["case_id"] == case_id
    ]

    return case


@app.route("/<case_id>", methods=["PUT"])
@auth.supabase
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
