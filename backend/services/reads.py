import services.unit_of_work as suow
import services.equipment.model as eq_mdl


def get_company_locations(uow: suow.DbPoolUnitOfWork, company_id: str) -> dict[str, dict]:
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
            l.name as loc_name
        from cases c
        join locations l on c.location_id = l.id
        where c.company_id = %s
        order by created_at
    """

    with uow, uow.db_pool.dict_cursor() as curs:
        curs.execute(sql, (company_id,))
        cases = curs.fetchall()

    return {
        case["id"]: {
            "id": case["id"],
            "case_id": case["case_id"],
            "name": case["case_name"],
            "location": case["loc_name"],
        }
        for case in cases
    }


def get_calibration_categories():
    return [category.value for category in eq_mdl.CalibrationCategory]


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
            json_agg(to_json(i.*) order by e.created_at) as images,
            json_agg(to_json(c.*) order by e.created_at) as calibrations
        from equipments e
        left join equipment_images i on e.id = i.equipment_id
        left join equipment_calibrations c on e.id = c.equipment_id
        where e.company_id = %s
        group by e.id, e.created_at
        order by e.created_at;
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
            "images": equipment["images"],
            "calibrations": equipment["calibrations"],
        }
        for equipment in equipments
    ]
