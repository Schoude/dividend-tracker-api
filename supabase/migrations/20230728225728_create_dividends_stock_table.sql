create table
  dividends_stock (
    id bigint generated by default as identity primary key,
    isin text,
    ex_date_unix bigint,
    ex_date_iso text,
    payment_date_unix bigint,
    payment_date_iso text,
    amount float,
    info text,
    stock_id bigint references stocks,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);
