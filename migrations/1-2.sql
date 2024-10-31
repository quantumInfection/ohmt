alter table equipments
    drop constraint equipments_status_check;

ALTER TABLE equipments
ADD CONSTRAINT status_check CHECK (status IN ('Active', 'Repair', 'Calibration', 'Retired', 'Archived'));
