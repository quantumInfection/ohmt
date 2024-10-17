def make_equipment(
    equipment: dict,
    locations_lookup: dict,
    cases_lookup: dict,
    calibration_providers_lookup: dict,
    categories_lookup: dict,
) -> dict:
    """Returns a view of the equipment, represents equipment in table format"""
    calibrations = equipment["calibrations"]
    if not calibrations:
        calibration_due_label = "NA"
        calibration_bg = "#F1F1F4"
        calibration_fg = "#212636"
        calibration_views = None
    else:
        calibration_due_label = "100 Days"
        calibration_bg = "#F1F1F4"
        calibration_fg = "#212636"
        calibration_views = [
            {
                "id": calibration["id"],
                "type": calibration["calibration_type"],
                "status": calibration["status"],
                "provider": calibration_providers_lookup[calibration["provider_id"]]["name"],
                "pdf_file_url": calibration["pdf_file_url"],
                "expiry_date": calibration["expiry_date"],
                "completion_date": calibration["completion_date"],
                "notes": calibration["notes"],
            }
            for calibration in calibrations
        ]

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
        "device_id": equipment["device_id"],
        "category": categories_lookup[equipment["category_id"]]["name"],
        "calibration_category": equipment["calibration_category"],
        "notes": equipment["notes"],
        "case_id": case_id,
        "calibration_due_label": calibration_due_label,
        "calibration_bg": calibration_bg,
        "calibration_fg": calibration_fg,
        "calibrations": calibration_views,
        "images": equipment["images"],
        "created_at": equipment["created_at"],
    }
