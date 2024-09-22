from flask import blueprints, request

import services.equipment.commands as eq_commands
import services.unit_of_work as eq_uow

app = blueprints.Blueprint("api_equipment", __name__, url_prefix="/v1/equipment")


# TODO: Add auth
@app.route("/", methods=["POST"])
def create_equipment():
    """
    Create equipment

    args:
        company_id: str  # TODO: Auth
        asset_id: str
        device_id: str
        model: str
        serial_number: str
        case_id: str
        location_id: str
        image_urls: str
        status: str
        category_id: str,
    """
    args = request.get_json()

    # Create equipment
    eq_commands.create_equipment(
        eq_uow.DbPoolUnitOfWork(),
        args["company_id"],  # TODO: Replace using auth
        args["asset_id"],
        args["device_id"],
        args["model"],
        args["serial_number"],
        args["case_id"],
        args["image_urls"],
        args["primary_image_index"],
        args["status"],
        args["category_id"],
        args["calibration_category"],
        args["notes"],
    )

    return "OK"


@app.route("/<equipment_id>", methods=["PUT"])
def update_equipment_status(equipment_id):
    """
    Update equipment status

    args:
        company_id: str # TODO: Auth
    """
    args = request.get_json()

    # Update equipment status
    eq_commands.update_equipment_status(
        eq_uow.DbPoolUnitOfWork(), equipment_id, args["status"]
    )

    return "OK"


@app.route("/<equipment_id>/calibration", methods=["POST"])
def add_calibration_to_equipment(equipment_id):
    """
    Add calibration to equipment

    args:
        company_id: str
        provider_id: str
        calibration_type: str
        completion_date: date
        expiry_date: date
        pdf_file_url: str
        notes: str
    """
    args = request.get_json()

    # Add calibration to equipment
    eq_commands.add_calibration_to_equipment(
        eq_uow.DbPoolUnitOfWork(),
        equipment_id,
        args["provider_id"],
        args["calibration_type"],
        args["completion_date_iso"],
        args["expiry_date_iso"],
        args["pdf_file_url"],
        args["notes"],
    )

    return "OK"


@app.route("/", methods=["GET"])
def list_equipments():
    """
    List equipments

    args:
        company_id: str,  # TODO: Auth
    """
    pass
