/*==================================================
  Modules
==================================================*/

const fetch = require("node-fetch");

/*==================================================
  Constants
  ==================================================*/

const BNB_CONVERSION_FACTOR = 10 ** 8;
const USDX_CONVERSION_FACTOR = 10 ** 6;

/*==================================================
Main
==================================================*/
var getCollateralPrice = async (market, block) => {
  let priceURL = "https://kava3.data.kava.io/pricefeed/price/" + market;
  priceURL = block ? priceURL + "?height=" + block : priceURL;
  const priceResponse = await fetch(priceURL);
  const priceData = await priceResponse.json();
  if(priceData && priceData.result && priceData.result.price) {
    return Number(priceData.result.price)
  }
  return 0;
}

var tvl = async (timestamp, block) => {
  const market = "bnb:usd";
  const bnbPrice = await getCollateralPrice(market, block);

  let bnbCdpsURL = "https://kava3.data.kava.io/cdp/cdps/denom/bnb";
  bnbCdpsURL = block ? bnbCdpsURL + "?height=" + block : bnbCdpsURL;
  const cdpResponse = await fetch(bnbCdpsURL);
  const cdpData = await cdpResponse.json();
  const cdpRes = cdpData && cdpData.result;

  let bnbLocked = 0;
  let usdxBorrowed = 0;
  let feesOwed = 0;
  for(var i = 0; i < cdpRes.length; i++) {
    const cdp = cdpRes[i].cdp;
    bnbLocked += Number(cdp.collateral.amount);
    usdxBorrowed += Number(cdp.principal.amount);
    feesOwed += Number(cdp.accumulated_fees.amount);
  };
  const totalLocked = bnbLocked/BNB_CONVERSION_FACTOR;
  const totalValueLocked = totalLocked * bnbPrice;

  const totalBorrowed = usdxBorrowed/USDX_CONVERSION_FACTOR;
  const totalFees = feesOwed/USDX_CONVERSION_FACTOR;

  return {
    locked: totalValueLocked,
    borrowed: totalBorrowed,
    fees: totalFees
  }
}

/*==================================================
Exports
==================================================*/

module.exports = {
  name: 'Kava',
  website: 'https://kava.io/',
  chain: 'Kava',
  category: 'Lending',
  token: 'KAVA',
  start: 1591797600, // 2020-06-10T14:00:00+00:00
  tvl,
};
