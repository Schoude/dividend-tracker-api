create table
  funds_sectors (
    fund_id bigint references funds,
    sector_id bigint references sectors,
    primary key (fund_id, sector_id)
);
