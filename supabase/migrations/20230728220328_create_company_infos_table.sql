create table
  company_infos (
    id bigint generated by default as identity primary key,
    isin text unique,
    name text,
    description text,
    yearFounded integer,
    peRatioSnapshot float,
    pbRatioSnapshot float,
    dividendYieldSnapshot float,
    marketCapSnapshot float,
    beta float,
    countryCode text,
    ceoName text null,
    cfoName text null,
    cooName text null,
    employeeCount integer null,
    eps float,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
  );
