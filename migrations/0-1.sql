create table companies
(
    id   uuid primary key,
    name text not null
);


create table locations
(
    id   uuid primary key,
    company_id uuid references companies (id) not null,
    name text not null
);

create table categories
(
    id   uuid primary key default gen_random_uuid(),
    company_id uuid references companies (id) not null,
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
    case_id              uuid                            references cases (id),
    location_id          uuid                            references locations (id),
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

create table calibration_providers
(
    id   uuid primary key default gen_random_uuid(),
    name text not null
);


create table equipment_calibrations
(
    id               uuid primary key                                    default gen_random_uuid(),
    equipment_id     uuid references equipments (id)            not null,
    provider_id      uuid references calibration_providers (id) not null,
    calibration_type text                                       not null check ( calibration_type in
                                                                                 ('Conformance',
                                                                                  'Initial',
                                                                                  'Re-Calibration',
                                                                                  'Repair')),
    completion_date  date                                       not null,
    expiry_date      date                                       not null,
    pdf_file_url     text                                       not null,
    notes            text,
    created_at       timestamp with time zone                   not null default now(),
    updated_at       timestamp with time zone
);
