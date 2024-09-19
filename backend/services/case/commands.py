import logging

import services.unit_of_work as suow
import services.case.model as case_model


def create_case(
    uow: suow.AbstractUnitOfWork,
    case_id: str,
    company_id: str,
    name: str,
    location_id: str,
) -> dict:
    """
    Creates a case
    :param uow:
    :param case_id: human readable unique identifier
    :param company_id:
    :param name:
    :param location_id:
    :return:
    """

    with uow:
        existing_case = uow.cases_repo.get(case_id)
        if existing_case:
            raise ValueError(f"Case with this ID: {case_id} already exists")

        case = case_model.Case.create(
            id=case_id,
            company_id=company_id,
            name=name,
            location_id=location_id,
        )

        uow.cases_repo.upsert(case)

    return case


def update_case_location(uow: suow.AbstractUnitOfWork, case_id: str, location_id: str):
    """
    Updates the location of a case
    :param uow:
    :param case_id:
    :param location_id:
    :return:
    """
    with uow:
        case = uow.cases_repo.get(case_id)

        if not case:
            raise ValueError(f"Case with ID: {case_id} not found")

        case.update_location(location_id)
        uow.cases_repo.upsert(case)

    return case
