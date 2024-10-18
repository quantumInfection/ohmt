from datetime import date

import services.equipment.model as eq_model
import services.unit_of_work as suow


def create_equipment(
    uow: suow.AbstractUnitOfWork,
    company_id: str,
    asset_id: str,
    device_id: str,
    model: str,
    serial_number: str,
    case_id: str | None,
    location_id: str | None,
    image_urls: list[str],
    primary_image_index: int,
    status: str,
    category_id: str,
    calibration_category: str,
    notes: str,
) -> eq_model.Equipment:
    with uow:
        if case_id:
            case = uow.cases_repo.get_by_id(case_id)
            if not case:
                raise ValueError(
                    f"Case with CASE: {case_id} and COMPANY: {company_id} not found"
                )
        else:
            assert location_id, "Location ID is required if case ID is not provided"

        equipment = eq_model.Equipment.create(
            company_id=company_id,
            asset_id=asset_id,
            device_id=device_id,
            model=model,
            serial_number=serial_number,
            case_id=case_id,
            location_id=location_id if not case_id else None,
            image_urls=image_urls,
            primary_image_index=primary_image_index,
            status=status,
            category_id=category_id,
            calibration_category=calibration_category,
            notes=notes,
        )

        uow.equipments_repo.add(equipment)

    return equipment


def update_equipment(
    uow: suow.AbstractUnitOfWork,
    equipment_id: str,
    status: str,
    case_id: str | None,
    location_id: str | None,
    image_urls: list[str],
    primary_image_index: int,
    notes: str,
) -> eq_model.Equipment:
    with uow:
        equipment = uow.equipments_repo.equipment_by_id(equipment_id)

        if not equipment:
            raise ValueError(f"Equipment with ID: {equipment_id} not found")

        if case_id:
            case = uow.cases_repo.get_by_id(case_id)
            if not case:
                raise ValueError(
                    f"Case with CASE: {case_id} and COMPANY: {equipment.company_id} not found"
                )
        else:
            assert location_id, "Location ID is required if case ID is not provided"

        equipment.update(
            status=status,
            case_id=case_id,
            location_id=location_id,
            image_urls=image_urls,
            primary_image_index=primary_image_index,
            notes=notes,
        )

        uow.equipments_repo.save(equipment)
    return equipment


def add_calibration_to_equipment(
    uow: suow.AbstractUnitOfWork,
    equipment_id: str,
    calibration_provider: str,
    calibration_type: str,
    completion_date_iso: str,
    expiry_date_iso: str,
    pdf_file_url: str,
    notes: str,
) -> eq_model.Equipment:
    with uow:
        equipment = uow.equipments_repo.equipment_by_id(equipment_id)

        if not equipment:
            raise ValueError(f"Equipment with ID: {equipment_id} not found")

        equipment.add_calibration(
            provider_id=calibration_provider,
            calibration_type=calibration_type,
            completion_date=date.fromisoformat(completion_date_iso),
            expiry_date=date.fromisoformat(expiry_date_iso),
            pdf_file_url=pdf_file_url,
            notes=notes,
        )

        uow.equipments_repo.save(equipment)
    return equipment


def update_calibration_on_equipment(
    uow: suow.AbstractUnitOfWork,
    equipment_id: str,
    calibration_id: str,
    calibration_provider: str,
    calibration_type: str,
    completion_date_iso: str,
    expiry_date_iso: str,
    pdf_file_url: str,
    notes: str,
) -> eq_model.Equipment:
    with uow:
        equipment = uow.equipments_repo.equipment_by_id(equipment_id)

        if not equipment:
            raise ValueError(f"Equipment with ID: {equipment_id} not found")

        equipment.update_calibration(
            cal_id=calibration_id,
            provider_id=calibration_provider,
            calibration_type=calibration_type,
            completion_date=date.fromisoformat(completion_date_iso),
            expiry_date=date.fromisoformat(expiry_date_iso),
            pdf_file_url=pdf_file_url,
            notes=notes,
        )

        uow.equipments_repo.save(equipment)
    return equipment
