import { supabase } from '../../../../src/supabase/client.ts';
import { stockDetails } from '../../output/stock-details.ts';

const companyInfos = stockDetails.map((stock) => {
  return {
    isin: stock.isin,
    beta: stock.company.beta,
    ceoname: stock.company.ceoName,
    cfoname: stock.company.cfoName,
    cooname: stock.company.cooName,
    countrycode: stock.company.countryCode,
    description: stock.company.description,
    dividendyieldsnapshot: stock.company.dividendYieldSnapshot,
    employeecount: stock.company.employeeCount,
    eps: stock.company.eps,
    marketcapsnapshot: stock.company.marketCapSnapshot,
    name: stock.company.name,
    pbratiosnapshot: stock.company.pbRatioSnapshot,
    peratiosnapshot: stock.company.peRatioSnapshot,
    yearfounded: stock.company.yearFounded,
  };
});

const { data, error } = await supabase.from('company_infos').insert(
  companyInfos,
)
  .select();

console.log({ data });
console.log({ error });
