const sdk = require('../../../sdk/index');

module.exports = {
    name: 'Fei Protocol',
    token: null,
    category: 'Assets',
    start: 1617087600, // Start of Tuesday March 30th PT
    tokenHolderMap: [
        {
            checkETHBalance: true,
            tokens: [
                '0x94b0a3d511b6ecdb17ebf877278ab030acb0a878', // FEI-ETH LP
                '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', // stETH
            ],
            holders: [
                '0xBFfB152b9392e38CdDc275D818a3Db7FE364596b', // GenesisGroup.sol
                '0xe1578B4a32Eaefcd563a9E6d0dc02a4213f673B7', // EthBondingCurve.sol
                '0xa08A721dFB595753FFf335636674D76C455B275C', // EthReserveStabilizer.sol
                '0xDa079A280FC3e33Eb11A78708B369D5Ca2da54fE', // EthPCVDripper.sol
                '0x5d6446880fcd004c851ea8920a628c70ca101117', // EthUniswapPCVDepost.sol
                '0x9b0C6299D08fe823f2C0598d97A1141507e4ad86', // EthUniswapPCVDeposit.sol (pre-FIP-5)
                '0xAc38Ee05C0204A1E119C625d0a560D6731478880', // EthLidoPCVDeposit.sol
            ],
        },
  ],
};