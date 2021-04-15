require("dotenv").config();

module.exports = {
  bsc: { api: require("./bsc-api") },
  api: require("./api"),
  util: require("./util")
};
