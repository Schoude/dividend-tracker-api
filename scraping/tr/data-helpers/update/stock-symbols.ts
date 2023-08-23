import { supabase } from '../../../../src/supabase/client.ts';

const trStocksWithBadSymbols = [
  // ## no symbols from TR
  {
    // no dividends
    isin: 'US30303M1027',
    name: 'Meta Platforms',
    intl_symbol: 'META',
  },
  {
    isin: 'BRVALEACNOR0',
    name: 'Vale',
    intl_symbol: 'VALE',
  },
  {
    isin: 'GB0007188757',
    name: 'Rio Tinto',
    intl_symbol: 'RIO',
  },
  {
    isin: 'US1270971039',
    name: 'Coterra Energy',
    intl_symbol: 'CTRA',
  },
  {
    isin: 'US09259E1082',
    name: 'BlackRock TCP Capital',
    intl_symbol: 'TCPC',
  },
  {
    isin: 'US4312841087',
    name: 'Highwoods Properties',
    intl_symbol: 'HIW',
  },
  {
    isin: 'US3026352068',
    name: 'FS KKR Capital',
    intl_symbol: 'FSK',
  },
  {
    isin: 'US7181721090',
    name: 'Philip Morris',
    intl_symbol: 'PM',
  },
  {
    isin: 'US78440X8873',
    name: 'SL Green Realty REIT',
    intl_symbol: 'SLG',
  },
  // ## Wrong symbols from TR
  {
    isin: 'US05508R1068',
    name: 'B&G Foods',
    intl_symbol: 'BGS',
  },
  {
    isin: 'US92343V1044',
    name: 'Verizon Communications',
    intl_symbol: 'VZ',
  },
  {
    isin: 'US2538681030',
    name: 'Digital Realty Trust',
    intl_symbol: 'DLR',
  },
  {
    isin: 'AU000000FMG4',
    name: 'Fortescue Metals',
    intl_symbol: 'FSUMF',
  },
  {
    isin: 'CA8934631091',
    name: 'TransAlta Renewables',
    intl_symbol: 'TSX/RNW',
  },
  {
    isin: 'GB0004544929',
    name: 'Imperial Brands',
    intl_symbol: 'IMBBY',
  },
  {
    isin: 'GB0002875804',
    name: 'British American Tobacco',
    intl_symbol: 'BTI',
  },
  {
    isin: 'DE0008404005',
    name: 'Allianz SE',
    intl_symbol: 'ALIZF',
  },
  {
    isin: 'GB00B10RZP78',
    name: 'Unilever',
    intl_symbol: 'UL',
  },
  // ### EXCEPTIONS because they don't pay dividends
  // or are not listed in dividendhistory
  // not US
  // {
  //   isin: "DE0007664039",
  //   name: "Volkswagen (Vz.)",
  //   intl_symbol: ''
  // },
  // not US
  // {
  //   isin: "DE000DTR0CK8",
  //   name: "Daimler Truck",
  //   intl_symbol: ''
  // },
  // not US
  // {
  //   isin: "DE0006062144",
  //   name: "Covestro",
  //   intl_symbol: ''
  // },
  // not US
  // {
  //   isin: "DE000A1J5RX9",
  //   name: "Telefonica Deutschland",
  //   intl_symbol: ''
  // },
  // not US
  // {
  //   isin: "GB00BP6MXD84",
  //   name: "Shell",
  //   intl_symbol: ''
  // },
  // no dividend
  // {
  //   isin: "FR0011648716",
  //   name: "Carbios",
  //   intl_symbol: ''
  // },
  // not US
  // {
  //   isin: "JP3270000007",
  //   name: "Kurita Water",
  //   intl_symbol: ''
  // },
  // no found on dividendhistory
  // {
  //   isin: "US30049A1079",
  //   name: "Evolution Petroleum",
  //   intl_symbol: ''
  // },
  // no dividend
  // {
  //   isin: "US90385V1070",
  //   name: "Ultra Clean",
  //   intl_symbol: ''
  // },
  // no dividend
  // {
  //   isin: "US7291321005",
  //   name: "Plexus",
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
