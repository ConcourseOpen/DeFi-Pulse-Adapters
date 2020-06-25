const axios = require('axios')

module.exports = {
  getSupportedTokens: async () => {
    const tokens = await axios.get('https://public.defipulse.com/api/TokenList')
    return tokens.data.map((token) => token.contract.toLowerCase())
  },
}
