create table locations
(
    id   uuid primary key,
    name text not null
);

create table categories
(
    id   uuid primary key default gen_random_uuid(),
    name text not null
);

insert into categories (name)
values ('Noise'),
       ('Dust'),
       ('Gas'),
       ('Laboratory'),
       ('Heat'),
       ('Lighting'),
       ('IAQ'),
       ('Vibration'),
       ('Other');


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


create table cases
(
    id          uuid primary key                        default gen_random_uuid(),
    company_id  uuid references companies (id) not null,
    case_id     text                           not null,
    name        text                           not null,
    location_id uuid references locations (id) not null,
    created_at  timestamp with time zone       not null default now(),
    updated_at  timestamp with time zone,
    unique (company_id, case_id)
);

create table equipments
(
    id                   uuid primary key                         default gen_random_uuid(),
    company_id           uuid references companies (id)  not null,
    asset_id             text                            not null,
    device_id            text                            not null,
    model                text                            not null,
    serial_number        text                            not null,
    case_id              uuid                            not null references cases (id),
    status               text                            not null check (status in ('Active', 'Repair', 'Calibration', 'Retired')),
    category_id          uuid references categories (id) not null,
    calibration_category text                            not null check (calibration_category in
                                                                         ('Nil Calibration',
                                                                          'Conformance',
                                                                          'Normal Calibration',
                                                                          'IANZ/NATA Calibration')),
    notes                text,
    created_at           timestamp with time zone        not null default now(),
    updated_at           timestamp with time zone
);


create table equipment_images
(
    id           uuid primary key                         default gen_random_uuid(),
    equipment_id uuid references equipments (id) not null,
    url          text                            not null,
    is_primary   boolean                         not null,
    created_at   timestamp with time zone        not null default now(),
    updated_at   timestamp with time zone
);
