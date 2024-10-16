import json

from flask import blueprints, request

import external_services.storage as storage
import services.equipment.commands as eq_commands
import services.reads as reads
import services.unit_of_work as eq_uow
import view.view as view

app = blueprints.Blueprint("api_equipment", __name__, url_prefix="/v1/equipments")

# Configure Spaces access


# TODO: Add auth
@app.route("/", methods=["POST"])
def create_equipment():
    """
    Create equipment

    args:
        asset_id: str
        device_id: str
        model: str
        serial_number: str
        case_id: str
        location_id: str
        image_urls: str
        primary_image_index: int
        status: str
        category_id: str
    """
    company_id = "16edda9a-299f-4ab4-a41c-922e637cad31"  # TODO: Replace using auth
    args = request.get_json()

    # Create equipment
    e = eq_commands.create_equipment(
        eq_uow.DbPoolUnitOfWork(),
        company_id=company_id,  # TODO: Replace using auth
        asset_id=args["asset_id"],
        device_id=args["device_id"],
        model=args["model"],
        serial_number=args["serial_number"],
        case_id=args.get("case_id"),
        location_id=args.get("location_id"),
        image_urls=args["image_urls"],
        primary_image_index=args["primary_image_index"],
        status=args["status"],
        category_id=args["category_id"],
        calibration_category=args["calibration_category"],
        notes=args["notes"],
    )

    return {
        "id": e.id,
        "name": e.model,
    }


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
    """
    company_id = "16edda9a-299f-4ab4-a41c-922e637cad31"

    calibration_categories = reads.get_calibration_categories()
    locations = reads.get_company_locations(eq_uow.DbPoolUnitOfWork(), company_id)
    categories = reads.get_company_categories(eq_uow.DbPoolUnitOfWork(), company_id)
    cases = reads.get_company_cases(eq_uow.DbPoolUnitOfWork(), company_id)
    equipments = reads.get_company_equipments(eq_uow.DbPoolUnitOfWork(), company_id)

    return {
        "equipments": [view.make_equipment(e, locations, cases) for e in equipments],
        "calibration_categories": calibration_categories,
        "locations": list(locations.values()),
        "categories": categories,
        "cases": list(cases.values()),
    }


@app.route("/images-signed-url", methods=["GET"])
def get_images_signed_url():
    """
    Get signed urls for images
    """
    args = request.args
    file_names = args.get("file_names")

    # Get signed urls for images
    return storage.get_signed_urls("equipment", json.loads(file_names))
