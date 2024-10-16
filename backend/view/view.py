def make_equipment(equipment: dict, locations_lookup: dict, cases_lookup: dict) -> dict:
    """Returns a view of the equipment, represents equipment in table format"""
    calibrations = equipment["calibrations"]
    if not calibrations:
        calibration_due_label = "NA"
        calibration_bg = "#F1F1F4"
        calibration_fg = "#212636"
    else:
        calibration_due_label = "NA"
        calibration_bg = "#F1F1F4"
        calibration_fg = "#212636"

    if equipment["case_id"] is None:
        case_id = None
        location_name = locations_lookup[equipment["location_id"]]["name"]
    else:
        case_id = equipment["case_id"]
        case = cases_lookup[case_id]
        case_id = case["case_id"]
        location_name = case["location"]

    return {
        "id": equipment["id"],
        "name": equipment["model"],
        "status_label": equipment["status"],
        "location": location_name,
        "case_id": case_id,
        "calibration_due_label": calibration_due_label,
        "calibration_bg": calibration_bg,
        "calibration_fg": calibration_fg,
    }
