import services.unit_of_work as suow
import services.equipment.model as eq_mdl


def get_calibration_providers(uow: suow.DbPoolUnitOfWork) -> dict[str, dict]:
    """
    Get all calibration providers
    :param uow:
    :return:
    """

    sql = """
        select
            id,
            name
        from calibration_providers
        order by name
    """

    with uow, uow.db_pool.dict_cursor() as curs:
        curs.execute(sql)
        providers = curs.fetchall()

    return {
        provider["id"]: {
            "id": provider["id"],
            "name": provider["name"],
        }
        for provider in providers
    }


def get_company_locations(
    uow: suow.DbPoolUnitOfWork, company_id: str
) -> dict[str, dict]:
    """
    Get all locations for a company
    :param uow:
    :param company_id:
    :return:
    """

    sql = """
        select
            id,
            name
        from locations
        where company_id = %s
        order by name
    """

    with uow, uow.db_pool.dict_cursor() as curs:
        curs.execute(sql, (company_id,))

        locations = curs.fetchall()

    return {
        location["id"]: {
            "id": location["id"],
            "name": location["name"],
        }
        for location in locations
    }


def get_company_cases(uow: suow.DbPoolUnitOfWork, company_id: str) -> dict[str, dict]:
    """
    Get all cases for a company, ordered by created_at
    :param uow:
    :param company_id:
    :return:
    """

    sql = """
        select
            c.id,
            c.case_id,
            c.name as case_name,
            l.id as loc_id,
            l.name as loc_name
        from cases c
        join locations l on c.location_id = l.id
        where c.company_id = %s
        order by created_at desc;
    """

    with uow, uow.db_pool.dict_cursor() as curs:
        curs.execute(sql, (company_id,))
        cases = curs.fetchall()

    return {
        case["id"]: {
            "id": case["id"],
            "case_readable_id": case["case_id"],
            "name": case["case_name"],
            "location_id": case["loc_id"],
            "location": case["loc_name"],
        }
        for case in cases
    }


def get_calibration_categories():
    return [category.value for category in eq_mdl.CalibrationCategory]


def get_calibration_types():
    return [category.value for category in eq_mdl.CalibrationType]


def get_company_categories(uow: suow.DbPoolUnitOfWork, company_id: str) -> list[dict]:
    """
    Get all categories for a company
    :param uow:
    :param company_id:
    :return:
    """

    sql = """
        select
            id,
            name
        from categories
        where company_id = %s
        order by name
    """

    with uow, uow.db_pool.dict_cursor() as curs:
        curs.execute(sql, (company_id,))
        categories = curs.fetchall()

    return [
        {
            "id": category["id"],
            "name": category["name"],
        }
        for category in categories
    ]


def get_company_equipments(uow: suow.DbPoolUnitOfWork, company_id: str) -> list[dict]:
    """
    Get all equipments for a company
    :param uow:
    :param company_id:
    :return:
    """

    sql = """
        select
            e.id,
            e.asset_id,
            e.device_id,
            e.model,
            e.serial_number,
            e.case_id,
            e.location_id,
            e.status,
            e.category_id,
            e.calibration_category,
            e.notes,
            e.created_at,
            e.updated_at,
            (
                select json_agg(to_json(i.*) order by i.created_at)
                from equipment_images i
                where i.equipment_id = e.id
            ) as images,
            (
                select json_agg(to_json(c.*) order by c.created_at)
                from equipment_calibrations c
                where c.equipment_id = e.id
            ) as calibrations
        from equipments e
        where e.company_id = %s
        order by e.created_at desc;
    """

    with uow, uow.db_pool.dict_cursor() as curs:
        curs.execute(sql, (company_id,))
        equipments = curs.fetchall()

    return [
        {
            "id": equipment["id"],
            "asset_id": equipment["asset_id"],
            "device_id": equipment["device_id"],
            "model": equipment["model"],
            "serial_number": equipment["serial_number"],
            "case_id": equipment["case_id"],
            "location_id": equipment["location_id"],
            "status": equipment["status"],
            "category_id": equipment["category_id"],
            "calibration_category": equipment["calibration_category"],
            "notes": equipment["notes"],
            "created_at": equipment["created_at"],
            "updated_at": equipment["updated_at"],
            "images": [
                {
                    "id": image["id"],
                    "url": image["url"],
                    "is_primary": image["is_primary"],
                    "created_at": image["created_at"],
                    "updated_at": image["updated_at"],
                }
                for image in equipment["images"]
            ],
            "calibrations": equipment["calibrations"],
        }
        for equipment in equipments
    ]
