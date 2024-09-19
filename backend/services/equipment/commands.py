import services.unit_of_work as eq_uow
import services.equipment.model as eq_model


def create_equipment(
    uow: eq_uow.AbstractUnitOfWork,
    company_id: str,
    name: str,
    asset_id: str,
    device_id: str,
    model: str,
    serial_number: str,
    case_id: str,
    image_urls: list[str],
    primary_image_index: int,
    status: str,
    category_id: str,
) -> eq_model.Equipment:
    with uow:
        case = uow.cases_repo.get(case_id, company_id)

        if not case:
            raise ValueError(
                f"Case with CASE: {case_id} and COMPANY: {company_id} not found"
            )

        equipment = eq_model.Equipment.create(
            company_id=company_id,
            name=name,
            asset_id=asset_id,
            device_id=device_id,
            model=model,
            serial_number=serial_number,
            case_id=case.id,
            image_urls=image_urls,
            primary_image_index=primary_image_index,
            status=status,
            category_id=category_id,
        )

        uow.equipments_repo.add(equipment)

    return equipment
