-- SQLite

-- Stock
-- 'has-many' relation on Dividend
SELECT dividends.*
FROM dividends
JOIN stocks ON dividends.stock_id = stocks.id
WHERE stocks.id = 1;


-- Dividend
-- 'has-one' relation on Stock
SELECT stocks.*
FROM stocks
JOIN dividends ON stocks.id = dividends.stock_id
WHERE stocks.id = 1
LIMIT 1;

-- all()
SELECT * FROM stocks;

-- findById()
SELECT *
FROM stocks
WHERE stocks.id = 1;
