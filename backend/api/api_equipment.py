from flask import blueprints, request

api_equipment = blueprints.Blueprint("api_equipment", __name__)
import services.equipment.commands as eq_commands
import services.equipment.unit_of_work as eq_uow


@api_equipment.route("/api/equipment", methods=["POST"])
def create_equipment():
    """
    Create equipment

    args:
        company_id: str,
        asset_id: str,
        device_id: str,
        model: str,
        serial_number: str,
        case_id: str,
        location_id: str,
        image_url: str,
        status: eq_model.Status,
        category_id: str,
        calibration_id: str | None,
    """
    args = request.get_json()

    # Create equipment
    equipment = eq_commands.create_equipment(
        eq_uow.DbPoolUnitOfWork(),
        args["company_id"],
        args["asset_id"],
        args["device_id"],
        args["model"],
        args["serial_number"],
        args["case_id"],
        args["location_id"],
        args["image_url"],
        args["status"],
        args["category_id"],
        args.get("calibration_id"),
    )

    return equipment.__dict__
