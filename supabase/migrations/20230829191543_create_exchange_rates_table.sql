create table
  exchange_rates (
    id bigint primary key generated always as identity,
    usd_eur float,
    eur_usd float,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now()
  );
