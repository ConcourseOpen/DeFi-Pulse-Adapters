const sdk = require('../../sdk');
const abi = require('./abi');


const POOL = '0xa1e72267084192db7387c8cc1328fade470e4149';
const RATING = '0x43A4F930F2cC35948d3a6dcd47CD0E50761f9B88';
const TRU = '0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784';
const TUSD = '0x0000000000085d4780B73119b644AE5ecd22b376';


async function tvl(timestamp, block) {
    let balances = {};

    const poolTVL = await sdk.api.abi.call({
      target: POOL,
      abi: abi['poolValue'],
      block: block 
    });
    const truTVL = await sdk.api.abi.call({
      target: TRU,
      params: RATING,
      abi: 'erc20:balanceOf',
      block: block 
    });
    
    balances[TUSD] = poolTVL.output;
    balances[TRU] = truTVL.output;
    
    return balances;
}



module.exports = {
  name: 'TrueFi',               // project name
  website: 'https://app.truefi.com',
  token: 'TRU',              
  category: 'lending',          // Lending
  start: 1605830400,            // 11/20/2020 @ 12:00am (UTC)
  tvl                           // tvl adapter
}