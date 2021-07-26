const axios = require('axios');

async function tvl() {
  const { data } = await axios.get("https://app.rari.capital/api/stats")
  console.log(data.tvl)
  return parseFloat(data.tvl);
}

module.exports = {
  name: "Rari",
  token: "RGT",
  category: "assets",
  start: 1594699200,
  tvl,
};
