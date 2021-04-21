const axios = require("axios");

module.exports = {
  /* Metadata */
  name: "Sablier",
  category: "Payments",
  start: 1573582731,
  token: null,
  tokenHolderMap: [
    {
      tokens: async () => {
        const result = await axios({
          url: "https://api.thegraph.com/subgraphs/name/sablierhq/sablier",
          method: "post",
          data: {
            query: `
              query AllTokens {
                tokens {
                  id
                }
              }
            `
          }
        });
        const allTokens = result.data.data.tokens;
        return allTokens.map(token => token.id );
      },
      holders: "0xA4fc358455Febe425536fd1878bE67FfDBDEC59a",
    },
  ],
};
