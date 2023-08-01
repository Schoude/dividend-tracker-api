# Project

Project Description

<em>[TODO.md spec & Kanban Board](https://bit.ly/3fCwKfM)</em>

### Todo

- [ ] add data script to fix the intl symbols -> update the wrong and empty symbols from TR
- [ ] add data script to fix the missing orders (mercedes (2 stocks), meta (1 stock))
- [ ] api route to get the portfolio, positions and stock/funds data with orders and dividends
- [ ] auth through supabase

### In Progress

### Done ✓

- [x] add user relation to portfolios table
- [x] users table
- [x] dividends_fund table -> data from etfDetails.distributions
- [x] dividends_stock table -> data from dividendhistory, for funds
- [x] orders table - consists of timeline items & relation to portfolio
- [x] positions -> portfolio_id, isin, instrument_type
