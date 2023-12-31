create table
  public.positions (
    id bigint generated by default as identity not null,
    isin text null,
    instrument_type text null,
    portfolio_id bigint null,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    constraint positions_pkey primary key (id),
    constraint positions_portfolio_id_fkey foreign key (portfolio_id) references portfolios (id) on delete cascade
  ) tablespace pg_default;
