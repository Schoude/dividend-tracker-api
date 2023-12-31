create table
  company_events (
    id bigint generated by default as identity primary key,
    isin text,
    event_id text,
    title text,
    description text,
    timestamp bigint,
    stock_id bigint references stocks,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
