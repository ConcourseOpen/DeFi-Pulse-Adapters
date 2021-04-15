// Credit to https://github.com/x0r2/etherscan/blob/master/index.mjs
const request = require("request-promise-native");

class Etherscan {
  constructor(apiKey, apiUrl) {
    this._apiKey = apiKey;
    this._apiUrl = apiUrl || "https://api.etherscan.io/api";
  }

  getEtherBalance(options) {
    return this._moduleAccount({
      action: "balance",
      address: options.address,
      tag: options.tag || "latest"
    });
  }

  getEtherBalanceMulti(options) {
    return this._moduleAccount({
      action: "balancemulti",
      address: options.address,
      tag: options.tag || "latest"
    });
  }

  getTxList(options) {
    return this._moduleAccount({
      action: "txlist",
      address: options.address,
      startblock: options.startBlock,
      endblock: options.endBlock,
      sort: options.sort
    });
  }

  getTxListInternal(options) {
    return this._moduleAccount({
      action: "txlistinternal",
      address: options.address,
      startblock: options.startBlock,
      endblock: options.endBlock,
      sort: options.sort
    });
  }

  _moduleAccount(params) {
    return this._query({
      ...params,
      module: "account"
    });
  }

  async _query(params) {
    if (this._apiKey) {
      params.apikey = this._apiKey;
    }
    const data = await request(this._apiUrl, {
      method: "POST",
      qsStringifyOptions: {
        arrayFormat: "repeat"
      },
      form: params,
      json: true
    });

    if (data.status !== "1") {
      return Promise.reject(`API returned result "${data.result}"`);
    }
    return data.result;
  }
}

module.exports = Etherscan;
