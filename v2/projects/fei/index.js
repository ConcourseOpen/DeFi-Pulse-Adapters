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
                '0x94b0a3d511b6ecdb17ebf877278ab030acb0a878', // FEI-ETH Uni V2 LP (NOTE: this counts both FEI and ETH, but only the FEI doesn't count as PCV)
                '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', // stETH
                '0x030ba81f1c18d280636f32af80b9aad02cf0854e', // aWETH
                '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5', // cETH
                '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', // cDAI
                '0x0954906da0Bf32d5479e25f46056d22f08464cab', // INDEX
                '0xc9BC48c72154ef3e5425641a3c747242112a46AF', // aRAI
                '0x752F119bD4Ee2342CE35E2351648d21962c7CAfE', // RAI in Fuse pool 9
                '0x8775aE5e83BC5D926b6277579c2B0d40c7D9b528', // FEI-DPI Sushi LP (NOTE: this counts both the FEI and the DPI, but only the FEI doesn't count as PCV)
                '0xF06f65a6b7D2c401FcB8B3273d036D21Fe2a5963', // DPI in Fuse pool 19
            ],
            holders: [
                // Holders of ETH
                '0x17305f0e18318994a57b494078CAC866A857F7b6', // EthReserveStabilizer.sol
                '0xB783c0E21763bEf9F2d04E6499abFbe23AdB7e1F', // EthBondingCurve.sol

                // Holders of FEI-ETH Uni V2 LP 
                '0x15958381E9E6dc98bD49655e36f524D2203a28bD', // EthUniswapPCVDeposit.sol

                // Holders of stETH
                '0xAc38Ee05C0204A1E119C625d0a560D6731478880', // EthLidoPCVDeposit.sol

                // Holders of aWETH
                '0x5B86887e171bAE0C2C826e87E34Df8D558C079B9', // AavePCVDeposit.sol

                // Holders of cETH
                '0x4fCB1435fD42CE7ce7Af3cB2e98289F79d2962b3', // EthCompoundPCVDeposit.sol  

                // Holders of cDAI
                '0xe0f73b8d76D2Ad33492F995af218b03564b8Ce20', // DaiCompoundPCVDeposit.sol

                // Holders of INDEX
                '0x0ee81df08B20e4f9E0F534e50da437D24491c4ee', // IndexSnapshotDelegator.sol

                // Holders of aRAI
                '0xd2174d78637a40448112aa6B30F9B19e6CF9d1F9', // AaveRaiPCVDeposit.sol
                
                // Holders of RAI in fuse pool 9
                '0x9aAdFfe00eAe6d8e59bB4F7787C6b99388A6960D', // RaiFusePcvDeposit.sol

                // Holders of FEI-DPI Sushi LP
                '0x902199755219A9f8209862d09F1891cfb34F59a3', // DpiSushiPcvDeposit.sol

                // Holders of RAI in Fuse pool 9
                '0x3dD3d945C4253bAc5B4Cc326a001B7d3f9C4DD66', // DpiFusePcvDeposit.sol

                
            ],
        },
  ],
};