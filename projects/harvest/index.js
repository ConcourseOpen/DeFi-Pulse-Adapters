/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const abi = require('./abi.json');
  const BigNumber = require('bignumber.js');
  const ERROR = BigNumber("3963877391197344453575983046348115674221700746820753546331534351508065746944")

/*==================================================
  TVL
  ==================================================*/

  const fTokens = {
    'fWETHv0':       {underlying: 'WETH', decimals: 18, contract: '0x8e298734681adbfC41ee5d17FF8B0d6d803e7098', created: 10861886 },
    'fUSDCv0':       {underlying: 'USDC', decimals: 6,  contract: '0xc3F7ffb5d5869B3ade9448D094d81B0521e8326f', created: 10770105 },
    'fUSDTv0':       {underlying: 'USDT', decimals: 6,  contract: '0xc7EE21406BB581e741FBb8B21f213188433D9f2F', created: 10770108 },
    'fTUSD':         {underlying: 'TUSD', decimals: 18, contract: '0x7674622c63Bee7F46E86a4A5A18976693D54441b', created: 10997721 },
    'fDAIv0':        {underlying: 'DAI',  decimals: 18, contract: '0xe85C8581e60D7Cd32Bbfd86303d2A4FA6a951Dac', created: 10770103 },
    'fWBTCv0':       {underlying: 'WBTC', decimals: 8,  contract: '0xc07EB91961662D275E2D285BdC21885A4Db136B0', created: 10802976 },
    'fRENBTCv0':     {underlying: 'RENBTC', decimals: 8, contract: '0xfBe122D0ba3c75e1F7C80bd27613c9f35B81FEeC', created: 10802986 },
    'fCRV-RENWBTCv0': {underlying: 'CRVRENWBTC', decimals: 18, contract: '0x192E9d29D43db385063799BC239E772c3b6888F3', created: 10815917 },
    'fUNI-DAI:WETHv0':  {underlying: 'UNI-DAI:WETH', decimals: 18, contract: '0x1a9F22b4C385f78650E7874d64e442839Dc32327', created: 10883048, type:'UNI' },
    'fUNI-USDC:WETHv0': {underlying: 'UNI-USDC:WETH', decimals: 18, contract: '0x63671425ef4D25Ec2b12C7d05DE855C143f16e3B', created: 10883030, type:'UNI' },
    'fUNI-WETH:USDTv0': {underlying: 'UNI-WETH:USDT', decimals: 18, contract: '0xB19EbFB37A936cCe783142955D39Ca70Aa29D43c', created: 10883026, type:'UNI' },
    'fUNI-WBTC:WETHv0': {underlying: 'UNI-WBTC:WETH', decimals: 18, contract: '0xb1FeB6ab4EF7d0f41363Da33868e85EB0f3A57EE', created: 10883054, type:'UNI' },
    'fUNI-DAI:WETH':    {underlying: 'UNI-DAI:WETH', decimals: 18, contract: '0x307E2752e8b8a9C29005001Be66B1c012CA9CDB7', created: 11041674, type:'UNI' },
    'fUNI-USDC:WETH':   {underlying: 'UNI-USDC:WETH', decimals: 18, contract: '0xA79a083FDD87F73c2f983c5551EC974685D6bb36', created: 11041667, type:'UNI' },
    'fUNI-WETH:USDT':   {underlying: 'UNI-WETH:USDT', decimals: 18, contract: '0x7DDc3ffF0612E75Ea5ddC0d6Bd4e268f70362Cff', created: 11011433, type:'UNI' },
    'fUNI-WBTC:WETH':   {underlying: 'UNI-WBTC:WETH', decimals: 18, contract: '0x01112a60f427205dcA6E229425306923c3Cc2073', created: 11041683, type:'UNI' },
    'fUNI-DPI:WETH':    {underlying: 'UNI-DPI:WETH', decimals: 18, contract: '0x2a32dcBB121D48C106F6d94cf2B4714c0b4Dfe48', created: 11374134, type:'UNI' },
    'fWETH':         {underlying: 'WETH',   decimals: 18, contract: '0xFE09e53A81Fe2808bc493ea64319109B5bAa573e', created: 11086824 },
    'fUSDC':         {underlying: 'USDC',   decimals: 6,  contract: '0xf0358e8c3CD5Fa238a29301d0bEa3D63A17bEdBE', created: 11086842 },
    'fUSDT':         {underlying: 'USDT',   decimals: 6,  contract: '0x053c80eA73Dc6941F518a68E2FC52Ac45BDE7c9C', created: 11086849 },
    'fDAI':          {underlying: 'DAI',    decimals: 18, contract: '0xab7FA2B2985BCcfC13c6D86b1D5A17486ab1e04C', created: 11086832 },
    'fWBTC':         {underlying: 'WBTC',   decimals: 8,  contract: '0x5d9d25c7C457dD82fc8668FFC6B9746b674d4EcB', created: 11068089 },
    'fRENBTC':       {underlying: 'RENBTC', decimals: 8, contract: '0xC391d1b08c1403313B0c28D47202DFDA015633C4', created: 11086855 },
    'fCRV-RENWBTC':  {underlying: 'CRVRENWBTC', decimals: 18, contract: '0x9aA8F427A17d6B0d91B6262989EdC7D45d6aEdf8', created: 11086865 },
    'fCRV-TBTC':  {underlying: 'CRV-TBTC',  decimals: 18, contract: '0x640704D106E79e105FDA424f05467F005418F1B5', created: 11230944 },
    'fCRV-HBTC':  {underlying: 'CRV-HBTC',  decimals: 18, contract: '0xCC775989e76ab386E9253df5B0c0b473E22102E2', created: 11380817 },
    'fCRV-HUSD':  {underlying: 'CRV-HUSD',  decimals: 18, contract: '0x29780C39164Ebbd62e9DDDE50c151810070140f2', created: 11380823 },
    'fCRV-BUSD':  {underlying: 'CRV-BUSD',  decimals: 18, contract: '0x4b1cBD6F6D8676AcE5E412C78B7a59b4A1bbb68a', created: 11257802 },
    'fCRV-COMP':  {underlying: 'CRV-COMP',  decimals: 18, contract: '0x998cEb152A42a3EaC1f555B1E911642BeBf00faD', created: 11257781 },
    'fCRV-USDN':  {underlying: 'CRV-USDN',  decimals: 18, contract: '0x683E683fBE6Cf9b635539712c999f3B3EdCB8664', created: 11257784 }, 
    'fCRV-YPOOL': {underlying: 'CRV-YPOOL', decimals: 18, contract: '0x0FE4283e0216F94f5f9750a7a11AC54D3c9C38F3', created: 11152258 },
    'fCRV-3POOL': {underlying: 'CRV-3POOL', decimals: 18, contract: '0x71B9eC42bB3CB40F017D8AD8011BE8e384a95fa5', created: 11159005 },
    'fSUSHI-WBTC:TBTC': {underlying: 'SUSHI-WBTC:TBTC', decimals: 18, contract: '0xF553E1f826f42716cDFe02bde5ee76b2a52fc7EB', created: 11036219 },
    'fSUSHI-WBTC:WETH': {underlying: 'SUSHI-WBTC:WETH', decimals: 18, contract: '0x5C0A3F55AAC52AA320Ff5F280E77517cbAF85524', created: 11269739 },
    'fSUSHI-USDC:WETH': {underlying: 'SUSHI-USDC:WETH', decimals: 18, contract: '0x01bd09A1124960d9bE04b638b142Df9DF942b04a', created: 11269722 },
    'fSUSHI-WETH:USDT': {underlying: 'SUSHI-WETH:USDT', decimals: 18, contract: '0x64035b583c8c694627A199243E863Bb33be60745', created: 11269716 },
    'fSUSHI-DAI:WETH':  {underlying: 'SUSHI-DAI:WETH',  decimals: 18, contract: '0x203E97aa6eB65A1A02d9E80083414058303f241E', created: 11269733 },
    'fUNI-BAC:DAI': {underlying: 'UNI-BAC:DAI', decimals: 18, contract: '0x6Bccd7E983E438a56Ba2844883A664Da87E4C43b', created: 11608433 },
    'fUNI-DAI:BAS': {underlying: 'UNI-DAI:BAS', decimals: 18, contract: '0xf8b7235fcfd5A75CfDcC0D7BC813817f3Dd17858', created: 11608445 },
    'fSUSHI-MIC:USDT': {underlying: 'SUSHI-MIC:USDT', decimals: 18, contract: '0x6F14165c6D529eA3Bfe1814d0998449e9c8D157D', created: 11608456 },
    'fSUSHI-MIS:USDT': {underlying: 'SUSHI-MIS:USDT', decimals: 18, contract: '0x145f39B3c6e6a885AA6A8fadE4ca69d64bab69c8', created: 11608466 },
    'fCRV-OBTC':  {underlying: 'CRV-OBTC',  decimals: 18, contract: '0x966A70A4d3719A6De6a94236532A0167d5246c72', created: 11639716 },
    'fONEINCH-WETH:DAI':  {underlying: 'ONEINCH-WETH:DAI',  decimals: 18, contract: '0x8e53031462e930827a8d482e7d80603b1f86e32d', created: 11647784 },
    'fONEINCH-WETH:USDC':  {underlying: 'ONEINCH-WETH:USDC',  decimals: 18, contract: '0xd162395c21357b126c5afed6921bc8b13e48d690', created: 11647839 },
    'fONEINCH-WETH:USDT':  {underlying: 'ONEINCH-WETH:USDT',  decimals: 18, contract: '0x4bf633a09bd593f6fb047db3b4c25ef5b9c5b99e', created: 11647866 },
    'fONEINCH-WETH:WBTC':  {underlying: 'ONEINCH-WETH:WBTC',  decimals: 18, contract: '0x859222dd0b249d0ea960f5102dab79b294d6874a', created: 11647897 },
    'fDAI:BSG':  {underlying: 'DAI:BSG',  decimals: 18, contract: '0x639d4f3F41daA5f4B94d63C2A5f3e18139ba9E54', created: 11660618 },
    'fDAI:BSGS':  {underlying: 'DAI:BSGS',  decimals: 18, contract: '0x633C4861A4E9522353EDa0bb652878B079fb75Fd', created: 11660626 },
    'fBAC':  {underlying: 'BAC',  decimals: 18, contract: '0x371E78676cd8547ef969f89D2ee8fA689C50F86B', created: 11655592 },
    'fESD':  {underlying: 'ESD',  decimals: 18, contract: '0x45a9e027DdD8486faD6fca647Bb132AD03303EC2', created: 11655609 },
    'fDSD':  {underlying: 'DSD',  decimals: 18, contract: '0x8Bf3c1c7B1961764Ecb19b4FC4491150ceB1ABB1', created: 11655624 },
    'fCRV-EURS':  {underlying: 'CRV-EURS',  decimals: 18, contract: '0x6eb941BD065b8a5bd699C5405A928c1f561e2e5a', created: 11674631 },
    'fCRV-UST':  {underlying: 'CRV-UST',  decimals: 18, contract: '0x84A1DfAdd698886A614fD70407936816183C0A02', created: 11680899 },
    'fMAAPL:UST':  {underlying: 'MAAPL:UST',  decimals: 18, contract: '0x11804D69AcaC6Ae9466798325fA7DE023f63Ab53', created: 11681744 },
    'fMAMZN:UST':  {underlying: 'MAMZN:UST',  decimals: 18, contract: '0x8334A61012A779169725FcC43ADcff1F581350B7', created: 11681033 },
    'fMGOOGL:UST':  {underlying: 'MGOOGL:UST',  decimals: 18, contract: '0x07DBe6aA35EF70DaD124f4e2b748fFA6C9E1963a', created: 11681049 },
    'fMTSLA:UST':  {underlying: 'MTSLA:UST',  decimals: 18, contract: '0xC800982d906671637E23E031e907d2e3487291Bc', created: 11681065 },
    'fCRV-STETH':  {underlying: 'CRV-STETH',  decimals: 18, contract: '0xc27bfE32E0a934a12681C1b35acf0DBA0e7460Ba', created: 11686113 },
    'fCRV-GUSD':  {underlying: 'CRV-GUSD',  decimals: 18, contract: '0xB8671E33fcFC7FEA2F7a3Ea4a117F065ec4b009E', created: 11745394 },
  };

  const uniPools = {
    'UNI-DAI:WETH': {contract: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11', created: 10042267,
                    token0: '0x6B175474E89094C44Da98b954EedeAC495271d0F', token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
    'UNI-USDC:WETH': {contract: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc', created: 10008355,
                    token0: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
    'UNI-WETH:USDT': {contract: '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852', created: 10093341,
                    token0: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', token1: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
    'UNI-WBTC:WETH': {contract: '0xBb2b8038a1640196FbE3e38816F3e67Cba72D940', created: 10091097,
                    token0: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
    'UNI-DPI:WETH': {contract: '0x4d5ef58aAc27d99935E5b6B4A6778ff292059991', created: 10836224,
                    token0: '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b', token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
    'SUSHI-WBTC:TBTC': {contract: '0x2Dbc7dD86C6cd87b525BD54Ea73EBeeBbc307F68', created: 10994541,
                    token0: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', token1: '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa' },
    'SUSHI-DAI:WETH': {contract: '0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f', created: 0,
                    token0: '0x6B175474E89094C44Da98b954EedeAC495271d0F', token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
    'SUSHI-USDC:WETH': {contract: '0x397FF1542f962076d0BFE58eA045FfA2d347ACa0', created: 0,
                    token0: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
    'SUSHI-WETH:USDT': {contract: '0x06da0fd433C1A5d7a4faa01111c044910A184553', created: 0,
                    token0: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', token1: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
    'SUSHI-WBTC:WETH': {contract: '0xCEfF51756c56CeFFCA006cD410B03FFC46dd3a58', created: 0,
                    token0: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
    'UNI-BAC:DAI': {contract: '0xd4405F0704621DBe9d4dEA60E128E0C3b26bddbD', created: 0,
                    token0: '0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a', token1: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
    'UNI-DAI:BAS': {contract: '0x0379dA7a5895D13037B6937b109fA8607a659ADF', created: 0,
                    token0: '0x6B175474E89094C44Da98b954EedeAC495271d0F', token1: '0xa7ED29B253D8B4E3109ce07c80fc570f81B63696' },
    'SUSHI-MIC:USDT': {contract: '0xC9cB53B48A2f3A9e75982685644c1870F1405CCb', created: 0,
                    token0: '0x368B3a58B5f49392e5C9E4C998cb0bB966752E51', token1: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
    'SUSHI-MIS:USDT': {contract: '0x066F3A3B7C8Fa077c71B9184d862ed0A4D5cF3e0', created: 0,
                    token0: '0x4b4D2e899658FB59b1D518b68fe836B100ee8958', token1: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
    'ONEINCH-WETH:DAI': {contract: '0x8e53031462e930827a8d482e7d80603b1f86e32d', created: 11647784,
                    token0: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', token1: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
    'ONEINCH-WETH:USDC': {contract: '0xd162395c21357b126c5afed6921bc8b13e48d690', created: 11647839,
                    token0: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', token1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
    'ONEINCH-WETH:USDT': {contract: '0x4bf633a09bd593f6fb047db3b4c25ef5b9c5b99e', created: 11647866,
                    token0: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', token1: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
    'ONEINCH-WETH:WBTC': {contract: '0x859222dd0b249d0ea960f5102dab79b294d6874a', created: 11647897,
                    token0: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', token1: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' },
    'DAI:BSG': {contract: '0x639d4f3F41daA5f4B94d63C2A5f3e18139ba9E54', created: 11660618,
                    token0: '0x6B175474E89094C44Da98b954EedeAC495271d0F', token1: '0xb34ab2f65c6e4f764ffe740ab83f982021faed6d' },
    'DAI:BSGS': {contract: '0x633C4861A4E9522353EDa0bb652878B079fb75Fd', created: 11660626,
                    token0: '0x6B175474E89094C44Da98b954EedeAC495271d0F', token1: '0xa9d232cc381715ae791417b624d7c4509d2c28db' },
    'MAAPL:UST': {contract: '0x11804D69AcaC6Ae9466798325fA7DE023f63Ab53', created: 11681744,
                    token0: '0xd36932143f6ebdedd872d5fb0651f4b72fd15a84', token1: '0xa47c8bf37f92abed4a126bda807a7b7498661acd' },
    'MAMZN:UST': {contract: '0x8334A61012A779169725FcC43ADcff1F581350B7', created: 11681033,
                    token0: '0x0cae9e4d663793c2a2a0b211c1cf4bbca2b9caa7', token1: '0xa47c8bf37f92abed4a126bda807a7b7498661acd' },
    'MGOOGL:UST': {contract: '0x07DBe6aA35EF70DaD124f4e2b748fFA6C9E1963a', created: 11681049,
                    token0: '0x59a921db27dd6d4d974745b7ffc5c33932653442', token1: '0xa47c8bf37f92abed4a126bda807a7b7498661acd' },
    'MTSLA:UST': {contract: '0xC800982d906671637E23E031e907d2e3487291Bc', created: 11681065,
                    token0: '0x21ca39943e91d704678f5d00b6616650f066fd63', token1: '0xa47c8bf37f92abed4a126bda807a7b7498661acd' },
  };

  async function tvl(timestamp, block) {
    const promises = [
      getUnderlying('fWETHv0',block),                 // 0
      getUnderlying('fDAIv0',block),
      getUnderlying('fUSDCv0',block),
      getUnderlying('fUSDTv0',block),
      getUnderlying('fTUSD',block),
      getUnderlying('fWBTCv0',block),                 // 5
      getUnderlying('fRENBTCv0',block),
      getUnderlying('fCRV-RENWBTCv0',block),
      getUniswapUnderlying('fUNI-DAI:WETHv0',block),
      getUniswapUnderlying('fUNI-USDC:WETHv0',block),
      getUniswapUnderlying('fUNI-WETH:USDTv0',block), // 10
      getUniswapUnderlying('fUNI-WBTC:WETHv0',block),
      getUniswapUnderlying('fUNI-DAI:WETH',block),
      getUniswapUnderlying('fUNI-USDC:WETH',block),
      getUniswapUnderlying('fUNI-WETH:USDT',block),
      getUniswapUnderlying('fUNI-WBTC:WETH',block),   // 15
      getUnderlying('fWETH',block),
      getUnderlying('fDAI',block),
      getUnderlying('fUSDC',block),
      getUnderlying('fUSDT',block),
      getUnderlying('fWBTC',block),                   // 20
      getUnderlying('fRENBTC',block),
      getUnderlying('fCRV-RENWBTC',block),
      getUniswapUnderlying('fSUSHI-WBTC:TBTC',block),
      getUniswapUnderlying('fSUSHI-DAI:WETH',block),
      getUniswapUnderlying('fSUSHI-USDC:WETH',block), // 25
      getUniswapUnderlying('fSUSHI-WETH:USDT',block),
      getUniswapUnderlying('fSUSHI-WBTC:WETH',block),
      getUniswapUnderlying('fUNI-DPI:WETH',block),
      getUnderlying('fCRV-HBTC',block),
      getUnderlying('fCRV-HUSD',block),               // 30
      getUnderlying('fCRV-BUSD',block),
      getUnderlying('fCRV-COMP',block),
      getUnderlying('fCRV-USDN',block),
      getUnderlying('fCRV-YPOOL',block),
      getUnderlying('fCRV-3POOL',block),              // 35
      getUnderlying('fCRV-TBTC',block),
      getUniswapUnderlying('fUNI-BAC:DAI',block),
      getUniswapUnderlying('fUNI-DAI:BAS',block),
      getUniswapUnderlying('fSUSHI-MIC:USDT',block),
      getUniswapUnderlying('fSUSHI-MIS:USDT',block),  // 40
      getUnderlying('fCRV-OBTC',block),
      getUnderlying('fONEINCH-WETH:DAI',block),
      getUnderlying('fONEINCH-WETH:USDC',block),
      getUnderlying('fONEINCH-WETH:USDT',block),
      getUnderlying('fONEINCH-WETH:WBTC',block),   // 45
      getUnderlying('fDAI:BSG',block),
      getUnderlying('fDAI:BSGS',block),
      getUnderlying('fBAC',block),
      getUnderlying('fESD',block),
      getUnderlying('fDSD',block),                    // 50
      getUnderlying('fCRV-EURS',block),
      getUnderlying('fCRV-UST',block),
      getUnderlying('fMAAPL:UST',block),
      getUnderlying('fMAMZN:UST',block),
      getUnderlying('fMGOOGL:UST',block),      // 55
      getUnderlying('fMTSLA:UST',block),
      getUnderlying('fCRV-STETH',block),
      getUnderlying('fCRV-GUSD',block),               // 58
    ];

    let results = await Promise.all(promises);

    let balances = {
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2':                         // asset: WETH
              BigNumber(results[0])                                         // fWETHv0
              .plus(BigNumber(results[16]))                                 // fWETH
              .plus(BigNumber(results[8][1]))                               // fUNI-DAI:WETHv0
              .plus(BigNumber(results[9][1]))                               // fUNI-USDC:WETHv0
              .plus(BigNumber(results[10][0]))                              // fUNI-WETH:USDTv0
              .plus(BigNumber(results[11][1]))                              // fUNI-WBTC:WETHv0
              .plus(BigNumber(results[12][1]))                              // fUNI-DAI:WETH
              .plus(BigNumber(results[13][1]))                              // fUNI-USDC:WETH
              .plus(BigNumber(results[14][0]))                              // fUNI-WETH:USDT
              .plus(BigNumber(results[15][1]))                              // fUNI-WBTC:WETH
              .plus(BigNumber(results[24][1]))                              // fSUSHI-DAI:WETH
              .plus(BigNumber(results[25][1]))                              // fSUSHI-USDC:WETH
              .plus(BigNumber(results[26][0]))                              // fSUSHI-WETH:USDT
              .plus(BigNumber(results[27][1]))                              // fSUSHI-WBTC:WETH
              .plus(BigNumber(results[28][1]))                              // fSUSHI-DPI:WETH
              .toFixed(0), // 18 decimals
      '0x6B175474E89094C44Da98b954EedeAC495271d0F':                         // asset: DAI
              BigNumber(results[1])                                         // fDAIv0
              .plus(BigNumber(results[17]))                                 // fDAI
              .plus(BigNumber(results[8][0]))                               // fUNI-DAI:WETHv0
              .plus(BigNumber(results[12][0]))                              // fUNI-DAI:WETH
              .plus(BigNumber(results[24][0]))                              // fSUSHI-DAI:WETH
              .plus(BigNumber(results[37][1]))                              // fSUSHI-BAC:DAI
              .plus(BigNumber(results[38][0]))                              // fSUSHI-DAI:BAS
              .toFixed(0), // 18 decimals
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48':                         // asset: USDC
              BigNumber(results[2])                                         // fUSDCv0
              .plus(BigNumber(results[18]))                                 // fUSDC
              .plus(BigNumber(results[9][0]))                               // fUNI-USDC:WETHv0
              .plus(BigNumber(results[13][0]))                              // fUNI-USDC:WETH
              .plus(BigNumber(results[25][0]))                              // fSUSHI-USDC:WETH
              .toFixed(0), // 6 decimals
      '0xdAC17F958D2ee523a2206206994597C13D831ec7':                         // asset: USDT
              BigNumber(results[3])                                         // fUSDTv0
              .plus(BigNumber(results[19]))                                 // fUSDT
              .plus(BigNumber(results[10][1]))                              // fUNI-WETH:USDTv0
              .plus(BigNumber(results[14][1]))                              // fUNI-WETH:USDT
              .plus(BigNumber(results[26][1]))                              // fSUSHI-WETH:USDT
              .plus(BigNumber(results[39][1]))                              // fSUSHI-MIC:USDT
              .plus(BigNumber(results[40][1]))                              // fSUSHI-MIS:USDT
              .toFixed(0), // 6 decimals
      '0x0000000000085d4780B73119b644AE5ecd22b376':                         // asset: TUSD
              BigNumber(results[4])                                         // fTUSD
              .toFixed(0), // 18 decimals
      '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599':                         // asset: WBTC
              BigNumber(results[5])                                         // fWBTCv0
              .plus(BigNumber(results[20]))                                 // fWBTC
              .plus(BigNumber(results[11][0]))                              // fUNI-WBTC:WETHv0
              .plus(BigNumber(results[15][0]))                              // fUNI-WBTC:WETH
              .plus(BigNumber(results[23][0]))                              // fSUSHI-WBTC:TBTC
              .plus(BigNumber(results[27][0]))                              // fSUSHI-WBTC:WETH
              .toFixed(0), // 8 decimals
      '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D':                         // asset: renBTC
              BigNumber(results[6])                                         // fRENBTCv0
              .plus(BigNumber(results[21]))                                 // fRENBTC
              .plus(BigNumber(results[7]).times(BigNumber("10").pow(-10)))  // fCRV-RENWBTCv0, estimate
              .plus(BigNumber(results[22]).times(BigNumber("10").pow(-10))) // fCRV-RENWBTC, estimate
              .toFixed(0), // 8 decimals
      '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa':                         // asset: TBTC
              BigNumber(results[23][1])                                     // fSUSHI-WBTC:TBTC SUSHI
              .plus(BigNumber(results[36]))                                 // fCRV-TBTC, estimate
              .toFixed(0), // 18 decimals
      '0xdF574c24545E5FfEcb9a659c229253D4111d87e1':                         // asset: HUSD
              BigNumber(results[30]).times(BigNumber("10").pow(-10))        // fCRV-HUSD, estimate
              .toFixed(0), // 8 decimals
      '0x0316EB71485b0Ab14103307bf65a021042c6d380':                         // asset: HBTC
              BigNumber(results[29])                                        // fCRV-HBTC, estimate
              .toFixed(0), // 18 decimals
      '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b':                         // asset: DPI
              BigNumber(results[28][0])                                     // fSUSHI-DPI:WETH
              .toFixed(0), // 18 decimals
      '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8':                         // asset: CRV-YPOOL
              BigNumber(results[34])                                        // fCRV-YPOOL
              .toFixed(0), // 18 decimals
      '0x845838DF265Dcd2c412A1Dc9e959c7d08537f8a2':                         // asset: CRV-COMPOUND
              BigNumber(results[32])                                        // fCRV-COMP
              .toFixed(0), // 18 decimals
      '0x3B3Ac5386837Dc563660FB6a0937DFAa5924333B':                         // asset: CRV-BUSD
              BigNumber(results[31])                                        // fCRV-BUSD
              .toFixed(0), // 18 decimals
      '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490':                         // asset: CRV-3POOL
              BigNumber(results[35])                                        // fCRV-3POOl
              .plus(BigNumber(results[33]))                                 // fCRV-USDN, estimate
              .toFixed(0), // 18 decimals
      '0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a':                         // asset: BAC
              BigNumber(results[37][0])                                     // fSUSHI-BAC:DAI
              .toFixed(0), // 18 decimals
      '0xa7ED29B253D8B4E3109ce07c80fc570f81B63696':                         // asset: BAS
              BigNumber(results[38][1])                                     // fSUSHI-DAI:BAS
              .toFixed(0), // 18 decimals
      '0x368B3a58B5f49392e5C9E4C998cb0bB966752E51':                         // asset: MIC
              BigNumber(results[39][0])                                     // fSUSHI-MIC:USDT
              .toFixed(0), // 18 decimals
      '0x4b4D2e899658FB59b1D518b68fe836B100ee8958':                         // asset: MIS
              BigNumber(results[40][0])                                     // fSUSHI-MIS:USDT
              .toFixed(0), // 18 decimals
      '0x8064d9Ae6cDf087b1bcd5BDf3531bD5d8C537a68':                         // asset: OBTC
              BigNumber(results[41])                                        // fSUSHI-MIS:USDT
              .toFixed(0), // 18 decimals
      '0x8e53031462e930827a8d482e7d80603b1f86e32d':                         // asset: ONEINCH-WETH:DAI
              BigNumber(results[42])                                     // fONEINCH-WETH:DAI
              .toFixed(0), // 18 decimals
      '0xd162395c21357b126c5afed6921bc8b13e48d690':                         // asset: ONEINCH-WETH:USDC
              BigNumber(results[43])                                     // fONEINCH-WETH:USDC
              .toFixed(0), // 18 decimals
      '0x4bf633a09bd593f6fb047db3b4c25ef5b9c5b99e':                         // asset: ONEINCH-WETH:USDT
              BigNumber(results[44])                                     // fONEINCH-WETH:USDT
              .toFixed(0), // 18 decimals
      '0x859222dd0b249d0ea960f5102dab79b294d6874a':                         // asset: ONEINCH-WETH:WBTC
              BigNumber(results[45])                                     // fONEINCH-WETH:WBTC
              .toFixed(0), // 18 decimals
      '0x639d4f3F41daA5f4B94d63C2A5f3e18139ba9E54':                         // asset: DAI:BSG
              BigNumber(results[46])                                     // fDAI:BSG
              .toFixed(0), // 18 decimals
      '0x633C4861A4E9522353EDa0bb652878B079fb75Fd':                         // asset: DAI:BSGS
              BigNumber(results[47])                                     // fDAI:BSGS
              .toFixed(0), // 18 decimals
      '0x371E78676cd8547ef969f89D2ee8fA689C50F86B':                         // asset: FARM-BAC
              BigNumber(results[48])                                        // fBAC
              .toFixed(0), // 18 decimals
      '0x45a9e027DdD8486faD6fca647Bb132AD03303EC2':                         // asset: FARM-ESD
              BigNumber(results[49])                                        // fESD
              .toFixed(0), // 18 decimals
      '0x8Bf3c1c7B1961764Ecb19b4FC4491150ceB1ABB1':                         // asset: FARM-DSD
              BigNumber(results[50])                                        // fDSD
              .toFixed(0), // 18 decimals
      '0x6eb941BD065b8a5bd699C5405A928c1f561e2e5a':                         // asset: CRV-EURS
              BigNumber(results[51])                                        // fCRV-EURS
              .toFixed(0), // 18 decimals
      '0x84A1DfAdd698886A614fD70407936816183C0A02':                         // asset: CRV-UST
              BigNumber(results[52])                                        // fCRV-UST
              .toFixed(0), // 18 decimals
      '0x11804D69AcaC6Ae9466798325fA7DE023f63Ab53':                         // asset: MAAPL:UST
              BigNumber(results[53])                                     // fMAAPL:UST
              .toFixed(0), // 18 decimals
      '0x8334A61012A779169725FcC43ADcff1F581350B7':                         // asset: MAMZN:UST
              BigNumber(results[54])                                     // fMAMZN:UST
              .toFixed(0), // 18 decimals
      '0x07DBe6aA35EF70DaD124f4e2b748fFA6C9E1963a':                         // asset: MGOOGL:UST
              BigNumber(results[55])                                     // fMGOOGL:UST
              .toFixed(0), // 18 decimals
      '0xC800982d906671637E23E031e907d2e3487291Bc':                         // asset: MTSLA:UST
              BigNumber(results[56])                                     // fMTSLA:UST
              .toFixed(0), // 18 decimals
      '0xc27bfE32E0a934a12681C1b35acf0DBA0e7460Ba':                         // asset: CRV-STETH
              BigNumber(results[57])                                        // fCRV-STETH
              .toFixed(0), // 18 decimals
      '0xB8671E33fcFC7FEA2F7a3Ea4a117F065ec4b009E':                         // asset: CRV-GUSD
              BigNumber(results[58])                                        // fCRV-GUSD
              .toFixed(0), // 18 decimals

      // TODO don't attribute CRV pools 1:1, factor virtualprice
      // TODO don't attribute all of CRV-HUSD to HUSD
      // TODO don't attribute all of CRV-RENWBTC to renBTC
      // TODO don't attribute all of CRV-TBTC to TBTC
      // TODO don't attribute all of CRV-HBTC to HBTC
      // TODO don't attribute all of CRV-OBTC to OBTC
      // TODO don't attribute all of CRV-USDN to to CRV-3POOL
    };
    // let supported = await sdk.api.util.tokenList();
    // console.table(supported); // print supported assets
    // console.table(balances); // for testing
    // console.table(results)
    return balances;
  }

  async function getUnderlying(token, block) {
    if (block > fTokens[token].created) {
      const promises = [
        sdk.api.abi.call({ block, target: fTokens[token].contract, abi: 'erc20:totalSupply', }),
        sdk.api.abi.call({ block, target: fTokens[token].contract, abi: abi['fABISharePrice'], }),
        sdk.api.abi.call({ block, target: fTokens[token].contract, abi: abi['fABIUnderlyingUnit'], })
      ];

      try {
        let results = await Promise.all(promises);
        if (results.length === 0) {
          return 0;
        }

        let fBalance = BigNumber(results[0].output);
        let fSharePrice = BigNumber(results[1].output);
        let fUnderlyingUnit = BigNumber(results[2].output);

        if (!fSharePrice.isEqualTo(ERROR)) {
          return fBalance.times(fSharePrice).div(fUnderlyingUnit);
        }
	else {
          // if shareprice is ERROR, assume shareprice is 1
	  return fBalance;
	}
      } catch (error) { return 0 }
      // if shareprice unavailable, assume shareprice is 0
    }
    return 0;
  }

  async function getUniswapUnderlying(token,block) {
    if (block > fTokens[token].created) {
      const underlyingPool = uniPools[fTokens[token].underlying];
      const promises = [
        sdk.api.abi.call({ block, target: fTokens[token].contract, abi: 'erc20:totalSupply', }),
        sdk.api.abi.call({ block, target: fTokens[token].contract, abi: abi['fABISharePrice'], }),
        sdk.api.abi.call({ block, target: fTokens[token].contract, abi: abi['fABIUnderlyingUnit'], }),
        sdk.api.abi.call({ block, target: underlyingPool.contract, abi: 'erc20:totalSupply', }),
        sdk.api.abi.call({ block, target: underlyingPool.contract, abi: abi['uniABIReserves'], }),
      ];

      try {
        let results = await Promise.all(promises);
        if (results.length === 0) {
          return [0, 0];
        }

        let poolBalance = BigNumber(results[0].output);
        let poolSharePrice = BigNumber(results[1].output);
        let poolUnderlyingUnit = BigNumber(results[2].output);
        let poolUnderlyingBalance = BigNumber(results[3].output);
        let poolUnderlyingReservesToken0 = BigNumber(results[4].output[0]);
        let poolUnderlyingReservesToken1 = BigNumber(results[4].output[1]);
	if (!poolSharePrice.isEqualTo(ERROR)) {
          let poolFraction = poolBalance.times(poolSharePrice).div(poolUnderlyingUnit).div(poolUnderlyingBalance);
          if (!poolFraction.isNaN()) {
            return [ poolFraction.times(poolUnderlyingReservesToken0), poolFraction.times(poolUnderlyingReservesToken1) ];
          }
	}
	else {
        // if shareprice is ERROR, assume shareprice is 1
          let poolFraction = poolBalance.div(poolUnderlyingBalance);
          if (!poolFraction.isNaN()) {
            return [ poolFraction.times(poolUnderlyingReservesToken0), poolFraction.times(poolUnderlyingReservesToken1) ];
          }
	}
      } catch (error) { return [0, 0] } // if shareprice unavailable, assume shareprice is 0
    }
    return [0, 0];
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Harvest Finance', // project name
    website: 'https://harvest.finance',
    token: 'FARM',            // null, or token symbol if project has a custom token
    category: 'assets',       // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1598893200,        // unix timestamp (utc 0) specifying when the project began, or where live data begins
    tvl                       // tvl adapter
  };
