import services.equipment.unit_of_work as eq_uow
import services.equipment.model as eq_model


def create_equipment(
    uow: eq_uow.AbstractUnitOfWork,
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
):
    """Creates an equipment"""
    with uow:
        equipment = eq_model.Equipment.create(
            company_id,
            asset_id,
            device_id,
            model,
            serial_number,
            case_id,
            location_id,
            image_url,
            status,
            category_id,
            calibration_id,
        )
        uow.equipments_repo.add(equipment)
        return equipment
