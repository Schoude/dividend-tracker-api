create table
  user_sessions (
    id bigint primary key generated always as identity,
    hash text,
    user_id bigint references users,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now()
  );
