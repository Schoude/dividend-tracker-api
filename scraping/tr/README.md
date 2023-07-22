# Trade Republic API

## Authenticating

Use `tr.http` to get a `tr_session` cookie. Send this with every `WebSocket`
request.

## Connecting to a WebSocket

WebSocket URL

`wss://api.traderepublic.com/`

Send this as the first request:

`connect 26 {"locale":"de","platformId":"webtrading","platformVersion":"chrome - 114.0.0","clientId":"app.traderepublic.com","clientVersion":"1.22.5"}`

The `clientVersion` might change in the future but can be retrieved from here:

`https://app.traderepublic.com/app-version.txt`

## Known WebSocket subscriptions

The number after `sub` in the request seems to be arbitraty and just there to
identify each subscription.

### a) Portofolio

`sub 1 {"type": "compactPortfolio", "token": "tr_session"}`

Returns an array of instruments. Carry on with the insturment request and then
stock or ETF details.

### b) Instrument

Works for stocks, funds and derivatives.

`sub 2 {"type": "instrument", "id": "ISIN", "jurisdiction": "DE", "token": "tr_session"}`

Instuments with `"typeId": "derivative"` don't have a separate details request.

> Interesting data can be found like the company logo and name, sectors,
> country, ISIN and international symbol. See `./examples/instrument.json`.

### c) Stock Details

Use this for `"typeId": "stock"` from the `instrument` response

`sub 53 {"type": "stockDetails", "id": "AU000000BHP4", "jurisdiction": "DE"}`

> Interesting data can be found like the curreny dividend yield or market cap.
> Also the names of the CEO, CFO or COO as well as the employee count. Upcoming
> events for the stock are also available as well as similar stocks and past,
> YTD and future dividend data. Summarized analyst ratings are also available.
> See `./examples/stock-details.json`.

### d) ETF Details

Use this for `"typeId": "fund"` from the `instrument` response

`sub 224 {"type": "etfDetails", "id": "IE00BJ5JNY98"}`

### e) Ticker for Instrument

Get the latest price

`sub 73 {"type": "ticker", "id": "LU2572257124.LSX"}`

### f) Favorites/Watchlist

`sub 10 {"type": "namedWatchlist", "watchlistId": "favorites"}`

Returns an array of instruments. Carry on with the insturment request and then
stock or ETF details like with the portfolio response.

### g) Timeline

`sub 12 {"type": "timeline"}`

Always just returns 30 entries. To get all entries, check the first recieved
message and then refetch with added
`{"after": "589967bf-069e-484d-b71d-3b67cb072e05"}`, where the guid is the
"cursor.after" from the response. Continue until the resonse is empty.

### h) Timeline Detail

`sub 71 {"type": "timelineDetail", "id": "589967bf-069e-484d-b71d-3b67cb072e05"}`

### i) Complete Stock lists by country or index

Can be done with `neonSearch`

This request is for US stocks in the Dow Jones, NASDAQ and S&P 500. In total
there where 10 pages à 50 stocks.

Try different page sizes.

`sub 345 {"type":"neonSearch","data":{"q":"","page":10,"pageSize":50,"filter":[{"key":"type","value":"stock"},{"key":"jurisdiction","value":"DE"},{"key":"country","value":"US"},{"key":"index","value":"dowjones,nasdaq,sp500"}]}}`

German stocks

`sub 868 {"type":"neonSearch","data":{"q":"","page":4,"pageSize":50,"filter":[{"key":"type","value":"stock"},{"key":"jurisdiction","value":"DE"},{"key":"country","value":"DE"},{"key":"index","value":"dax,eurostoxx50,mdax,sdax,techdax"}]}}`
