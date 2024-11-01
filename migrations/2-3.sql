-- enable the uuid-ossp extension to use uuid_generate_v4()
create extension if not exists "uuid-ossp";

-- create users table
create table users (
    id uuid primary key default uuid_generate_v4(),
    username text unique not null,
    password_hash text not null,
    email text unique not null,
    created_at timestamp with time zone default current_timestamp
);

-- create roles table
create table roles (
    id uuid primary key default uuid_generate_v4(),
    role_name text unique not null,
    description text
);

-- create pages table
create table pages (
    id uuid primary key default uuid_generate_v4(),
    page_name text unique not null,
    url text not null
);

-- create user_roles table to associate users with roles
create table user_roles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null,
    role_id uuid not null,
    foreign key (user_id) references users(id) on delete cascade,
    foreign key (role_id) references roles(id) on delete cascade
);

-- create role_permissions table to associate roles with pages and permissions
create table role_permissions (
    id uuid primary key default uuid_generate_v4(),
    role_id uuid not null,
    page_id uuid not null,
    can_view boolean default false,
    can_edit boolean default false,
    can_delete boolean default false,
    foreign key (role_id) references roles(id) on delete cascade,
    foreign key (page_id) references pages(id) on delete cascade
);