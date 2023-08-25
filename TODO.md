# Project

Project Description

<em> [TODO.md spec & Kanban Board](https://bit.ly/3fCwKfM)</em>

### Todo

- [ ] save USD/EUR exchange rate in db -> scrape from here
      https://www.comdirect.de/inf/waehrungen/us_dollar-euro-kurs
- [ ] auth through supabase

### In Progress

- [ ] update existing instruments
      - [x] prices stocks
      - [x] prices funds
      - [ ] company info
      - [ ] company events
      - [ ] analyst ratings
      - [ ] dividends stocks
      - [ ] dividends funds

### Done ✓

- [x] auth endpoints for TR (regular login and 2FA login)
- [x] Add route to SELL an instrument for a portfolio. Delete the instrument
      form the portolio positions if the amount is 0.
- [x] Add route to BUY an instrument for a portfolio. Also handle new
      instruments -> frontend should provide `isNew` boolean
- [x] add user relation to portfolios table
- [x] users table
- [x] dividends_fund table -> data from etfDetails.distributions
- [x] dividends_stock table -> data from dividendhistory, for funds
- [x] orders table - consists of timeline items & relation to portfolio
- [x] positions -> portfolio_id, isin, instrument_type
- [x] add data script to fix the intl symbols -> update the wrong and empty
      symbols from TR
- [x] add data script to fix the missing orders (mercedes (2 stocks), meta (1
      stock), Daimler Truck Holding (1), Tesla (1))
- [x] FIX timeline and timeline details scrape for savings plan orders
- [x] api route to get the portfolio, positions and stock/funds data with orders
      and dividends
