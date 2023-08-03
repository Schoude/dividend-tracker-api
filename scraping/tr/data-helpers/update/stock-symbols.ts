import { supabase } from '../../../../src/supabase/client.ts';

const trStocksWithBadSymbols = [
  // ## no symbols from TR
  {
    // no dividends
    isin: 'US30303M1027',
    company_name: 'Meta Platforms',
    intl_symbol: 'META',
  },
  {
    isin: 'BRVALEACNOR0',
    company_name: 'Vale',
    intl_symbol: 'VALE',
  },
  {
    isin: 'GB0007188757',
    company_name: 'Rio Tinto',
    intl_symbol: 'RIO',
  },

  {
    isin: 'US1270971039',
    company_name: 'Coterra Energy',
    intl_symbol: 'CTRA',
  },
  {
    isin: 'US09259E1082',
    company_name: 'BlackRock TCP Capital',
    intl_symbol: 'TCPC',
  },
  {
    isin: 'US4312841087',
    company_name: 'Highwoods Properties',
    intl_symbol: 'HIW',
  },
  {
    isin: 'US3026352068',
    company_name: 'FS KKR Capital',
    intl_symbol: 'FSK',
  },
  {
    isin: 'US7181721090',
    company_name: 'Philip Morris',
    intl_symbol: 'PM',
  },
  {
    isin: 'US78440X8873',
    company_name: 'SL Green Realty REIT',
    intl_symbol: 'SLG',
  },
  // ## Wrong symbols from TR
  {
    isin: 'US05508R1068',
    company_name: 'B&G Foods',
    intl_symbol: 'BGS',
  },
  {
    isin: 'US92343V1044',
    company_name: 'Verizon Communications',
    intl_symbol: 'VZ',
  },
  {
    isin: 'US2538681030',
    company_name: 'Digital Realty Trust',
    intl_symbol: 'DLR',
  },
  {
    isin: 'AU000000FMG4',
    company_name: 'Fortescue Metals',
    intl_symbol: 'FSUMF',
  },
  {
    isin: 'CA8934631091',
    company_name: 'TransAlta Renewables',
    intl_symbol: 'TSX/RNW',
  },
  {
    isin: 'GB0004544929',
    company_name: 'Imperial Brands',
    intl_symbol: 'IMBBY',
  },
  {
    isin: 'GB0002875804',
    company_name: 'British American Tobacco',
    intl_symbol: 'BTI',
  },
  // ### EXCEPTIONS because they don't pay dividends
  // or are not listed in dividendhistory
  // not US
  // {
  //   isin: "DE0007664039",
  //   company_name: "Volkswagen (Vz.)",
  //   intl_symbol: ''
  // },
  // not US
  // {
  //   isin: "DE000DTR0CK8",
  //   company_name: "Daimler Truck",
  //   intl_symbol: ''
  // },
  // not US
  // {
  //   isin: "DE0006062144",
  //   company_name: "Covestro",
  //   intl_symbol: ''
  // },
  // not US
  // {
  //   isin: "DE000A1J5RX9",
  //   company_name: "Telefonica Deutschland",
  //   intl_symbol: ''
  // },
  // not US
  // {
  //   isin: "GB00BP6MXD84",
  //   company_name: "Shell",
  //   intl_symbol: ''
  // },
  // no dividend
  // {
  //   isin: "FR0011648716",
  //   company_name: "Carbios",
  //   intl_symbol: ''
  // },
  // not US
  // {
  //   isin: "JP3270000007",
  //   company_name: "Kurita Water",
  //   intl_symbol: ''
  // },
  // no found on dividendhistory
  // {
  //   isin: "US30049A1079",
  //   company_name: "Evolution Petroleum",
  //   intl_symbol: ''
  // },
  // no dividend
  // {
  //   isin: "US90385V1070",
  //   company_name: "Ultra Clean",
  //   intl_symbol: ''
  // },
  // no dividend
  // {
  //   isin: "US7291321005",
  //   company_name: "Plexus",
  //   intl_symbol: ''
  // },
];

console.log('Stocks to update: ', trStocksWithBadSymbols.length);

let updatedCount = 0;
for await (const stock of trStocksWithBadSymbols) {
  const updatedStock = await supabase.from('stocks')
    .update({ intl_symbol: stock.intl_symbol })
    .eq('isin', stock.isin)
    .select('isin, intl_symbol')
    .single();

  if (updatedStock.error) {
    console.log(updatedStock.error);
  } else {
    updatedCount++;
    console.log(updatedStock.data);
  }
}

console.log('Stocks updated: ', updatedCount);
