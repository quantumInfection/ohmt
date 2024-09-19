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
    equipment = eq_commands.create_equipment(
        eq_uow.DbPoolUnitOfWork(),
        args["company_id"],  # TODO: Replace using auth
        args["name"],
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

    return {
        "id": equipment.id,
        "company_id": equipment.company_id,
        "name": equipment.name,
        "asset_id": equipment.asset_id,
        "device_id": equipment.device_id,
        "model": equipment.model,
        "serial_number": equipment.serial_number,
        "case_id": equipment.case_id,
        "images": [
            {"id": image.id, "url": image.url, "primary": image.primary}
            for image in equipment.images
        ],
        "status": equipment.status.value,
        "category_id": equipment.category_id,
        "calibration_category": equipment.calibration_category.value,
        "notes": equipment.notes,
    }


@app.route("/", methods=["GET"])
def list_equipments():
    """
    List equipments

    args:
        company_id: str,  # TODO: Auth
    """
    pass
