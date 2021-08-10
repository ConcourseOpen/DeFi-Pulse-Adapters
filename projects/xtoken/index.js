/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const abi = require("./abi.json");
const SNX = require("./SNX.json");
const xU3LP = require("./xU3LP.json");
const TradeAccountingContract = require("./TradeAccountingContract.json");
const ethers = require("ethers");

/*==================================================
  Settings
  ==================================================*/

// xtoken addresses
const xaaveaAddr = "0x80DC468671316E50D4E9023D3db38D3105c1C146";
const xaavebAddr = "0x704De5696dF237c5B9ba0De9ba7e0C63dA8eA0Df";
const xbntaAddr = "0x6949f1118FB09aD2567fF675f96DbB3B6985ACd0";
const xinchaAddr = "0x8F6A193C8B3c949E1046f1547C3A3f0836944E4b";
const xinchbAddr = "0x6B33f15360cedBFB8F60539ec828ef52910acA9b";
const xkncaAddr = "0x0bfEc35a1A3550Deed3F6fC76Dde7FC412729a91";
const xkncbAddr = "0x06890D4c65A4cB75be73D7CCb4a8ee7962819E81";
const xkncaV1Addr = "0xB088b2C7cE300f3fe679d471C2cE49dFE312Ce75";
const xkncbV1Addr = "0x0c8bCCc8eADa871656266A1f7ad37aaFFC4b20b3";
const xsnxaAddr = "0x1Cf0f3AaBE4D12106B27Ab44df5473974279C524";
const xsnxaAdminAddr = "0x7Cd5E2d0056a7A7F09CBb86e540Ef4f6dCcc97dd";
const tradeAccountingContractAddr =
  "0x6461E964D687E7ca3082bECC595D079C6c775Ac8";
const xu3lpaAddr = "0xDa4d2152B2230e33c80b0A88b7C28b1C464EE3c2";
const xu3lpbAddr = "0x420CF01fdC7e3c42c3D89ae8799bACCBfFa9ceAA";
const xu3lpcAddr = "0x74e87FBA6C4bCd17fe5f14D73f590eD3C13E821B";

const xu3lps = [
  "0xdD699Eae49A3504a28AeB9BD76a3f0369fA08471",
  "0x828EC6E678A40c251f1F37DA389db0f820Af6f9D",
  "0x4296d40183356A770Fd8cA3Ba0592f0163BE9CA3",
  "0x28ce95124FB0d5Febe6Ab258072848f5fe1010eC",
  "0x9ed880b7F75a220C0450E4884521ba8d500eb4bb",
];

// token addresses
const ethAddr = "0x0000000000000000000000000000000000000000";
const aaveAddr = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9";
const bntAddr = "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C";
const inchAddr = "0x111111111117dC0aa78b770fA6A738034120C302";
const kncAddr = "0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202";
const snxAddr = "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F";
const ethrsi6040Addr = "0x93E01899c10532d76C0E864537a1D26433dBbDdB";
const usdcAddr = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const usdtAddr = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const daiAddr = "0x6b175474e89094c44da98b954eedeac495271d0f";
const sUsdAddr = "0x57ab1e02fee23774580c119740129eac7081e9d3";

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  // xAAVEa created at block 11338426
  let xaaveaFundHoldings = ethers.BigNumber.from("0");
  if (block >= 11338426) {
    try {
      xaaveaFundHoldings = await sdk.api.abi.call({
        block,
        target: xaaveaAddr,
        abi: abi["getFundHoldings"],
      });
      xaaveaFundHoldings = ethers.BigNumber.from(xaaveaFundHoldings.output);
    } catch (err) {
      console.log("xAAVEa err : ", err);
      xaaveaFundHoldings = ethers.BigNumber.from("0");
    }
  }

  // xAAVEb created at block 11341971
  let xaavebFundHoldings = ethers.BigNumber.from("0");
  if (block >= 11341971) {
    try {
      xaavebFundHoldings = await sdk.api.abi.call({
        block,
        target: xaavebAddr,
        abi: abi["getFundHoldings"],
      });

      xaavebFundHoldings = ethers.BigNumber.from(xaavebFundHoldings.output);
    } catch (err) {
      console.log("xAAVEb err : ", err);
      xaavebFundHoldings = ethers.BigNumber.from("0");
    }
  }

  // combine xAAVEa and xAAVEb AAVE amts
  const combinedXaaveAave = xaaveaFundHoldings.add(xaavebFundHoldings);
  const formatAave = ethers.utils
    .formatUnits(combinedXaaveAave, 0)
    .split(".")[0];

  // xBNTa created at block 12285460
  let xbntaStaked = ethers.BigNumber.from("0");
  let xbntaBuffer = ethers.BigNumber.from("0");
  let xbntaPending = ethers.BigNumber.from("0");
  if (block >= 12285460) {
    try {
      xbntaStaked = await sdk.api.abi.call({
        block,
        target: xbntaAddr,
        abi: abi["totalAllocatedNavBnt"],
      });

      xbntaBuffer = await sdk.api.abi.call({
        block,
        target: xbntaAddr,
        abi: abi["getBufferBalanceBnt"],
      });

      xbntaPending = await sdk.api.abi.call({
        block,
        target: xbntaAddr,
        abi: abi["getRewardsContributionToNavBnt"],
      });

      xbntaStaked = ethers.BigNumber.from(xbntaStaked.output);
      xbntaBuffer = ethers.BigNumber.from(xbntaBuffer.output);
      xbntaPending = ethers.BigNumber.from(xbntaPending.output);
    } catch (err) {
      console.log("xBNTa err : ", err);
      xbntaStaked = ethers.BigNumber.from("0");
      xbntaBuffer = ethers.BigNumber.from("0");
      xbntaPending = ethers.BigNumber.from("0");
    }
  }

  const combinedXbntBnt = xbntaStaked.add(xbntaBuffer).add(xbntaPending);
  const formatBnt = ethers.utils.formatUnits(combinedXbntBnt, 0).split(".")[0];

  // xINCHa created at block 11739841
  let xinchaFundHoldings = ethers.BigNumber.from("0");
  if (block >= 11739841) {
    try {
      xinchaFundHoldings = await sdk.api.abi.call({
        block,
        target: xinchaAddr,
        abi: abi["getNav"],
      });
      xinchaFundHoldings = ethers.BigNumber.from(xinchaFundHoldings.output);
    } catch (err) {
      console.log("xINCHa err : ", err);
      xinchaFundHoldings = ethers.BigNumber.from("0");
    }
  }

  // xINCHb created at block 11740005
  let xinchbFundHoldings = ethers.BigNumber.from("0");
  if (block >= 11740005) {
    try {
      xinchbFundHoldings = await sdk.api.abi.call({
        block,
        target: xinchbAddr,
        abi: abi["getNav"],
      });

      xinchbFundHoldings = ethers.BigNumber.from(xinchbFundHoldings.output);
    } catch (err) {
      console.log("xINCHb err : ", err);
      xinchbFundHoldings = ethers.BigNumber.from("0");
    }
  }

  // combine xINCHa and xINCHb 1INCH amts
  const combinedXinchInch = xinchaFundHoldings.add(xinchbFundHoldings);
  const formatInch = ethers.utils
    .formatUnits(combinedXinchInch, 0)
    .split(".")[0];

  // xKNCa v1 created at block 10431752 - project start
  // xKNCa v2 created at block 11818344
  let xkncaFundHoldings = ethers.BigNumber.from("0");
  let xkncaFundHoldingsV1 = ethers.BigNumber.from("0");
  if (block >= 10431752 && block < 11818344) {
    try {
      xkncaFundHoldingsV1 = await sdk.api.abi.call({
        block,
        target: xkncaV1Addr,
        abi: abi["getFundKncBalanceTwei"],
      });

      xkncaFundHoldingsV1 = ethers.BigNumber.from(xkncaFundHoldingsV1.output);
    } catch (err) {
      console.log("xKNCa V1 err : ", err);
      xkncaFundHoldingsV1 = ethers.BigNumber.from("0");
    }
  }

  if (block >= 11818344) {
    try {
      xkncaFundHoldings = await sdk.api.abi.call({
        block,
        target: xkncaAddr,
        abi: abi["getFundKncBalanceTwei"],
      });

      xkncaFundHoldings = ethers.BigNumber.from(xkncaFundHoldings.output);
    } catch (err) {
      console.log("xKNCa err : ", err);
      xkncaFundHoldings = ethers.BigNumber.from("0");
    }
  }

  // xKNCb v1 created at block 10432544
  // xKNCb v2 created at block 11836794
  let xkncbFundHoldings = ethers.BigNumber.from("0");
  let xkncbFundHoldingsV1 = ethers.BigNumber.from("0");
  if (block >= 10432544 && block < 11836794) {
    try {
      xkncbFundHoldingsV1 = await sdk.api.abi.call({
        block,
        target: xkncbV1Addr,
        abi: abi["getFundKncBalanceTwei"],
      });

      xkncbFundHoldingsV1 = ethers.BigNumber.from(xkncbFundHoldingsV1.output);
    } catch (err) {
      console.log("xKNCb V1 err : ", err);
      xkncbFundHoldingsV1 = ethers.BigNumber.from("0");
    }
  }

  if (block >= 11836794) {
    try {
      xkncbFundHoldings = await sdk.api.abi.call({
        block,
        target: xkncbAddr,
        abi: abi["getFundKncBalanceTwei"],
      });

      xkncbFundHoldings = ethers.BigNumber.from(xkncbFundHoldings.output);
    } catch (err) {
      console.log("xKNCb err : ", err);
      xkncbFundHoldings = ethers.BigNumber.from("0");
    }
  }

  // combine xKNCa and xKNCb KNC amts
  const combinedXkncKnc = xkncaFundHoldings
    .add(xkncbFundHoldings)
    .add(xkncaFundHoldingsV1)
    .add(xkncbFundHoldingsV1);
  const formatKnc = ethers.utils.formatUnits(combinedXkncKnc, 0).split(".")[0];

  // xSNXa created at block 10971007
  let xsnxaSnx = ethers.BigNumber.from("0");
  let xsnxaSusd = ethers.BigNumber.from("0");
  let xsnxaEth = ethers.BigNumber.from("0");
  let xsnxaEthrsi6040 = ethers.BigNumber.from("0");
  if (block >= 10971007) {
    try {
      // SNX amount
      xsnxaSnx = await sdk.api.abi.call({
        block,
        target: tradeAccountingContractAddr,
        abi: TradeAccountingContract["getSnxBalance"],
      });

      xsnxaSnx = xsnxaSnx.output;

      // sUSD amount
      xsnxaSusd = await sdk.api.abi.call({
        block,
        target: snxAddr,
        abi: SNX["debtBalanceOf"],
        params: [xsnxaAdminAddr, ethers.utils.formatBytes32String("sUSD")],
      });

      xsnxaSusd = xsnxaSusd.output;

      // ETH amount
      xsnxaEth = await sdk.api.abi.call({
        block,
        target: tradeAccountingContractAddr,
        abi: TradeAccountingContract["getEthBalance"],
      });

      xsnxaEth = xsnxaEth.output;

      // ETHRSI6040 amount
      xsnxaEthrsi6040 = await sdk.api.erc20.balanceOf({
        block,
        target: ethrsi6040Addr,
        owner: xsnxaAdminAddr,
      });

      xsnxaEthrsi6040 = xsnxaEthrsi6040.output;
    } catch (err) {
      console.log("xSNXa err : ", err);
      xsnxaSnx = ethers.BigNumber.from("0");
      xsnxaSusd = ethers.BigNumber.from("0");
      xsnxaEth = ethers.BigNumber.from("0");
      xsnxaEthrsi6040 = ethers.BigNumber.from("0");
    }
  }

  const formatXsnxaSnx = ethers.utils.formatUnits(xsnxaSnx, 0).split(".")[0];
  const formatXsnxaSusd = ethers.utils.formatUnits(xsnxaSusd, 0).split(".")[0];
  const formatXsnxaEth = ethers.utils.formatUnits(xsnxaEth, 0).split(".")[0];
  const formatXsnxaEthrsi6040 = ethers.utils
    .formatUnits(xsnxaEthrsi6040, 0)
    .split(".")[0];

  // xU3LP
  let xu3lpaDaiBufferHoldings = ethers.BigNumber.from("0");
  let xu3lpaUsdcBufferHoldings = ethers.BigNumber.from("0");
  let xu3lpaDaiStakedBalance = ethers.BigNumber.from("0");
  let xu3lpaUsdcStakedBalance = ethers.BigNumber.from("0");
  if (block >= 12413286) {
    try {
      xu3lpaDaiBufferHoldings = await sdk.api.abi.call({
        block,
        target: xu3lpaAddr,
        abi: xU3LP["getBufferToken0Balance"],
      });

      xu3lpaUsdcBufferHoldings = await sdk.api.abi.call({
        block,
        target: xu3lpaAddr,
        abi: xU3LP["getBufferToken1Balance"],
      });

      xu3lpaStakedTokenBalance = await sdk.api.abi.call({
        block,
        target: xu3lpaAddr,
        abi: xU3LP["getStakedTokenBalance"],
      });

      xu3lpaDaiStakedBalance = ethers.BigNumber.from(
        xu3lpaStakedTokenBalance.output.amount0
      );
      xu3lpaUsdcStakedBalance = ethers.BigNumber.from(
        xu3lpaStakedTokenBalance.output.amount1
      );

      xu3lpaDaiBufferHoldings = ethers.BigNumber.from(
        xu3lpaDaiBufferHoldings.output
      );
      xu3lpaUsdcBufferHoldings = ethers.BigNumber.from(
        xu3lpaUsdcBufferHoldings.output
      );
    } catch (err) {
      console.log("xU3LPa err : ", err);
      xu3lpaDaiStakedBalance = ethers.BigNumber.from("0");
      xu3lpaUsdcStakedBalance = ethers.BigNumber.from("0");
      xu3lpaDaiBufferHoldings = ethers.BigNumber.from("0");
      xu3lpaUsdcBufferHoldings = ethers.BigNumber.from("0");
    }
  }

  let xu3lpbUsdcBufferHoldings = ethers.BigNumber.from("0");
  let xu3lpbUsdcStakedBalance = ethers.BigNumber.from("0");
  let xu3lpbUsdtBufferHoldings = ethers.BigNumber.from("0");
  let xu3lpbUsdtStakedBalance = ethers.BigNumber.from("0");
  if (block >= 12414532) {
    try {
      xu3lpbUsdcBufferHoldings = await sdk.api.abi.call({
        block,
        target: xu3lpbAddr,
        abi: xU3LP["getBufferToken0Balance"],
      });

      xu3lpbUsdtBufferHoldings = await sdk.api.abi.call({
        block,
        target: xu3lpbAddr,
        abi: xU3LP["getBufferToken1Balance"],
      });

      xu3lpbStakedTokenBalance = await sdk.api.abi.call({
        block,
        target: xu3lpbAddr,
        abi: xU3LP["getStakedTokenBalance"],
      });

      xu3lpbUsdcStakedBalance = ethers.BigNumber.from(
        xu3lpbStakedTokenBalance.output.amount0
      );
      xu3lpbUsdtStakedBalance = ethers.BigNumber.from(
        xu3lpbStakedTokenBalance.output.amount1
      );

      xu3lpbUsdcBufferHoldings = ethers.BigNumber.from(
        xu3lpbUsdcBufferHoldings.output
      );
      xu3lpbUsdtBufferHoldings = ethers.BigNumber.from(
        xu3lpbUsdtBufferHoldings.output
      );
    } catch (err) {
      console.log("xU3LPb err : ", err);
      xu3lpbUsdcStakedBalance = ethers.BigNumber.from("0");
      xu3lpbUsdtStakedBalance = ethers.BigNumber.from("0");
      xu3lpbUsdcBufferHoldings = ethers.BigNumber.from("0");
      xu3lpbUsdtBufferHoldings = ethers.BigNumber.from("0");
    }
  }

  let xu3lpcSusdBufferHoldings = ethers.BigNumber.from("0");
  let xu3lpcSusdStakedBalance = ethers.BigNumber.from("0");
  let xu3lpcUsdcBufferHoldings = ethers.BigNumber.from("0");
  let xu3lpcUsdcStakedBalance = ethers.BigNumber.from("0");
  if (block >= 12415305) {
    // TODO: add try - catch
    try {
      xu3lpcSusdBufferHoldings = await sdk.api.abi.call({
        block,
        target: xu3lpcAddr,
        abi: xU3LP["getBufferToken0Balance"],
      });

      xu3lpcUsdcBufferHoldings = await sdk.api.abi.call({
        block,
        target: xu3lpcAddr,
        abi: xU3LP["getBufferToken1Balance"],
      });

      xu3lpcStakedTokenBalance = await sdk.api.abi.call({
        block,
        target: xu3lpcAddr,
        abi: xU3LP["getStakedTokenBalance"],
      });

      xu3lpcSusdStakedBalance = ethers.BigNumber.from(
        xu3lpcStakedTokenBalance.output.amount0
      );
      xu3lpcUsdcStakedBalance = ethers.BigNumber.from(
        xu3lpcStakedTokenBalance.output.amount1
      );

      xu3lpcSusdBufferHoldings = ethers.BigNumber.from(
        xu3lpcSusdBufferHoldings.output
      );
      xu3lpcUsdcBufferHoldings = ethers.BigNumber.from(
        xu3lpcUsdcBufferHoldings.output
      );
    } catch (err) {
      console.log("xU3LPc err : ", err);
      xu3lpcSusdStakedBalance = ethers.BigNumber.from("0");
      xu3lpcUsdcStakedBalance = ethers.BigNumber.from("0");
      xu3lpcSusdBufferHoldings = ethers.BigNumber.from("0");
      xu3lpcUsdcBufferHoldings = ethers.BigNumber.from("0");
    }
  }

  const combinedXu3lpaDai = xu3lpaDaiBufferHoldings.add(xu3lpaDaiStakedBalance);
  const combinedXu3lpaUsdc = xu3lpaUsdcBufferHoldings.add(
    xu3lpaUsdcStakedBalance
  );

  const combinedXu3lpbUsdc = xu3lpbUsdcBufferHoldings.add(
    xu3lpbUsdcStakedBalance
  );
  const combinedXu3lpbUsdt = xu3lpbUsdtBufferHoldings
    .add(xu3lpbUsdtStakedBalance)
    .div(Math.pow(10, 12));

  const combinedXu3lpcSusd = xu3lpcSusdBufferHoldings.add(
    xu3lpcSusdStakedBalance
  );
  const combinedXu3lpcUsdc = xu3lpcUsdcBufferHoldings.add(
    xu3lpcUsdcStakedBalance
  );

  const combinedUsdc = combinedXu3lpaUsdc
    .add(combinedXu3lpbUsdc)
    .add(combinedXu3lpcUsdc)
    .div(Math.pow(10, 12));

  const formatUsdc = ethers.utils.formatUnits(combinedUsdc, 0).split(".")[0];

  const formatDai = ethers.utils
    .formatUnits(combinedXu3lpaDai, 0)
    .split(".")[0];

  const formatUsdt = ethers.utils
    .formatUnits(combinedXu3lpbUsdt, 0)
    .split(".")[0];

  const formatSusd = ethers.utils
    .formatUnits(combinedXu3lpcSusd, 0)
    .split(".")[0];

  let balances = {
    [aaveAddr.toLowerCase()]: formatAave, // AAVE
    [bntAddr.toLowerCase()]: formatBnt, // BNT
    [inchAddr.toLowerCase()]: formatInch, // 1INCH
    [kncAddr.toLowerCase()]: formatKnc, // KNC
    [snxAddr.toLowerCase()]: formatXsnxaSnx, // SNX
    [ethAddr.toLowerCase()]: formatXsnxaEth, // ETH
    [ethrsi6040Addr.toLowerCase()]: formatXsnxaEthrsi6040, // ETHRSI6040
    [usdcAddr.toLowerCase()]: formatUsdc, // USDC
    [daiAddr.toLowerCase()]: formatDai, // DAI
    [usdtAddr.toLowerCase()]: formatUsdt, // USDT
    [sUsdAddr.toLowerCase()]: formatSusd, // sUSD
  };

  for (let xu3lp of xu3lps) {
    try {
      let pool = (
        await sdk.api.abi.call({
          block,
          target: xu3lp,
          abi: abi["poolAddress"],
        })
      ).output;

      let token0 = (
        await sdk.api.abi.call({
          block,
          target: pool,
          abi: abi["token0"],
        })
      ).output;

      let token1 = (
        await sdk.api.abi.call({
          block,
          target: pool,
          abi: abi["token1"],
        })
      ).output;

      let buffer0 = (
        await sdk.api.abi.call({
          block,
          target: xu3lp,
          abi: xU3LP["getBufferToken0Balance"],
        })
      ).output;

      let buffer1 = (
        await sdk.api.abi.call({
          block,
          target: xu3lp,
          abi: xU3LP["getBufferToken1Balance"],
        })
      ).output;

      let staked = (
        await sdk.api.abi.call({
          block,
          target: xu3lp,
          abi: xU3LP["getStakedTokenBalance"],
        })
      ).output;

      let decimal0 = (
        await sdk.api.abi.call({
          block,
          target: xu3lp,
          abi: abi["token0DecimalMultiplier"],
        })
      ).output;

      let decimal1 = (
        await sdk.api.abi.call({
          block,
          target: xu3lp,
          abi: abi["token1DecimalMultiplier"],
        })
      ).output;

      balances[token0.toLowerCase()] = balances[token0.toLowerCase()]
        ? ethers.utils
            .formatUnits(
              ethers.BigNumber.from(buffer0)
                .add(staked.amount0)
                .div(decimal0)
                .add(balances[token0.toLowerCase()]),
              0
            )
            .split(".")[0]
        : ethers.utils
            .formatUnits(
              ethers.BigNumber.from(buffer0).add(staked.amount0).div(decimal0),
              0
            )
            .split(".")[0];
      balances[token1.toLowerCase()] = balances[token1.toLowerCase()]
        ? ethers.utils
            .formatUnits(
              ethers.BigNumber.from(buffer1)
                .add(staked.amount1)
                .div(decimal1)
                .add(balances[token1.toLowerCase()]),
              0
            )
            .split(".")[0]
        : ethers.utils
            .formatUnits(
              ethers.BigNumber.from(buffer1).add(staked.amount1).div(decimal1),
              0
            )
            .split(".")[0];
    } catch (e) {
      console.log(e);
    }
  }

  return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "xToken", // project name
  token: "XTK", // null, or token symbol if project has a custom token
  category: "assets", // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1594383978, // unix timestamp (utc 0) specifying when the project began, or where live data begins
  tvl, // tvl adapter
};
