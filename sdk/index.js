require("dotenv").config();

module.exports = {
  bsc: require("./bsc-api"),
  api: require("./api"),
  util: require("./util"),
};
