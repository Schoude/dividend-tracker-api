create table
  stocks_sectors (
    stock_id bigint references stocks,
    sector_id bigint references sectors,
    primary key (stock_id, sector_id)
  );
