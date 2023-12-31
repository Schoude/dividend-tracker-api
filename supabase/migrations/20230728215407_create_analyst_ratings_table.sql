create table
 analyst_ratings (
  id bigint generated by default as identity primary key,
  isin text unique,
  target_price_high float,
  target_price_average float,
  target_price_low float,
  recommendations_buy int,
  recommendations_outperform int,
  recommendations_hold int,
  recommendations_underperform int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
