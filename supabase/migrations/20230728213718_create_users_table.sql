create table
  users (
    id bigint primary key generated always as identity,
    name text,
    email text,
    password text,
    created_at timestamp with time zone not null default timezone ('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone ('utc'::text, now())
  )
