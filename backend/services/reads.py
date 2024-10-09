import services.unit_of_work as suow


def get_company_locations(uow: suow.DbPoolUnitOfWork, company_id: str) -> list[dict]:
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

    return [
        {
            "id": location["id"],
            "name": location["name"],
        }
        for location in locations
    ]

def get_company_cases(uow: suow.DbPoolUnitOfWork, company_id: str) -> list[dict]:
    """
    Get all cases for a company, ordered by created_at
    :param uow:
    :param company_id:
    :return:
    """

    sql = """
        select
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

    return [
        {
            "id": case["case_id"],
            "name": case["case_name"],
            "location": case["loc_name"],
        }
        for case in cases
    ]
