create table locations
(
    id   uuid primary key,
    name text not null
);

create table categories
(
    id   uuid primary key,
    name text not null
);

create table calibrations
(
    id uuid primary key
    -- todo: add more fields as the calibration class grows
);


create table companies
(
    id   uuid primary key,
    name text not null
);


create table equipment
(
    id             uuid primary key,
    company_id     uuid references companies (id)  not null,
    asset_id       text                            not null,
    device_id      text                            not null,
    model          text                            not null,
    serial_number  text                            not null,
    case_id        text                            not null,
    location_id    uuid references locations (id)  not null,
    image_url      text,
    status         text                            not null check (status in ('Active', 'Repair', 'Calibration', 'Retired')),
    category_id    uuid references categories (id) not null,
    calibration_id uuid references calibrations (id)
);
