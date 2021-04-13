const { toSymbols, getLogs, kyberTokens } = require("../dist/util");

describe("util", () => {
  test("toSymbols", async () => {
    const result = await toSymbols({
      "0x0000000000000000000000000000000000000000": "1000000000000000000", // ETH
      "0x6B175474E89094C44Da98b954EedeAC495271d0F": "2000000000000000000", // DAI
    });
    expect(result).toEqual({
      ETH: "1",
      DAI: "2",
    });
  });

  test("toSymbols uniswap", async () => {
    const result = await toSymbols({
      "0x0000000000000000000000000000000000000000": "1233093695601654770153",
      "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2": "176131336126871165469",
      "0xe41d2489571d322189246dafa5ebde1f4699f498": "9135587031253378421438",
      "0xdd974d5c2e2928dea5f71b9825b8b646686bd200": "2040787481605505500925",
      "0x514910771af9ca656af840dff83e8264ecf986ca": "425948887831908483789",
      "0x744d70fdbe2ba4cf95131626614a1763df805b9e": "192528337683165645042275",
      "0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206": "1108910081510237807556",
      "0x419d0d8bdd9af5e606ae2232ed285aff190e711b": "186016955120293",
      "0x0d8775f648430679a709e98d2b0cb6250d2887ef": "10783680871192530449336",
      "0xaa7a9ca87d3694b5755f213b5d04094b8d0f0a6f": "5835326340760401980",
      "0x8eb24319393716668d768dcec29356ae9cffe285": "363712922746",
      "0x1776e1f26f98b1a5df9cd347953a26dd3cb46671": "7720877679642399687797",
      "0x58b6a8a3302369daec383334672404ee733ab239": "185508692762421183171",
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "187253387608788533133",
      "0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27": "39410479848655",
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "486061181009",
      "0x818fc6c2ec5986bc6e2cbf00939d90556ab12ce5": "13512562980409108428560727",
      "0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b": "18531688639",
      "0x8e870d67f660d95d5be530380d0ec0bd388289e1": "153229557525271657673",
      "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": "4426881",
      "0x6c6ee5e31d828de241282b9606c8e98ea48526e2": "2319044110675109400910",
      "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c": "3105581668410251217215",
      "0x4e15361fd6b4bb609fa63c81a2be19d873717870": "16170423384586599343788",
      "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c": "981216937881606870",
      "0xdac17f958d2ee523a2206206994597c13d831ec7": "1",
      "0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac": "432700266",
      "0x5af2be193a6abca9c8817001f45744777db30756": "3244574698",
      "0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d": "621533",
      "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd": "7263163318692814745776",
      "0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3": "656548855252008117",
      "0x6fb3e0a217407efff7ca062d46c26e5d60a14d69": "2344703312571599090124",
      "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f": "286132709191069655076",
      "0x4f9254c83eb525f9fcf346490bbb3ed28a81c667": "2429980110153549761",
      "0x4fabb145d64652a948d72533023f6e7a623c7c53": "16054747920350892743",
      "0xba11d00c5f74255f56a5e366f4f77f5a186d7f55": "7392938059818854460792",
      "0x8ce9137d39326ad0cd6491fb5cc0cba0e089b6a9": "35980317805495806534",
      "0x6b175474e89094c44da98b954eedeac495271d0f": "395607749603594555522689",
      "0xcb97e65f07da24d46bcdd078ebebd7c6e6e3d750": "318066152",
      "0x85eee30c52b0b379b046fb0f85f4f3dc3009afec": "2596872751640228",
      "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9": "2636507258",
      "0xeb4c2781e4eba804ce9a9803c67d0893436bb27d": "10410",
      "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984": "13281619836296510126",
    });
    expect(result).toMatchSnapshot();
  });

  test("getLogs", async () => {
    const result = await getLogs(
      "0x9424B1412450D0f8Fc2255FAf6046b98213B76Bd",
      "LOG_NEW_POOL(address,address)",
      [],
      9562480,
      10411347
    );
    expect(result.slice(0, 3)).toMatchSnapshot();
  });

  test("getLogs with large block range", async () => {
    const input = {
      keys: [],
      toBlock: 12202080,
      target: "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95",
      fromBlock: 6627917,
      topic: "NewExchange(address,address)",
    };
    await getLogs(input.target, input.topic, input.keys, input.fromBlock, input.toBlock);
  }, 100000);

  test("getLogs with keys", async () => {
    const expectedResult = [
      [
        "0x8ccec77b0cb63ac2cafd0f5de8cdfadab91ce656d262240ba8a6343bccc5f945",
        "0x00000000000000000000000018fa2ac3c88112e36eff15370346f9aff3161fd1",
        "0x000000000000000000000000165a50bc092f6870dc111c349bae5fc35147ac86",
      ],
      [
        "0x8ccec77b0cb63ac2cafd0f5de8cdfadab91ce656d262240ba8a6343bccc5f945",
        "0x00000000000000000000000018fa2ac3c88112e36eff15370346f9aff3161fd1",
        "0x00000000000000000000000057755f7dec33320bca83159c26e93751bfd30fbe",
      ],
      [
        "0x8ccec77b0cb63ac2cafd0f5de8cdfadab91ce656d262240ba8a6343bccc5f945",
        "0x00000000000000000000000018fa2ac3c88112e36eff15370346f9aff3161fd1",
        "0x000000000000000000000000e5d1fab0c5596ef846dcc0958d6d0b20e1ec4498",
      ],
    ];
    const result = await getLogs(
      "0x9424B1412450D0f8Fc2255FAf6046b98213B76Bd",
      "LOG_NEW_POOL(address,address)",
      ["topics"],
      9562480,
      10411347
    );
    expect(result.slice(0, 3)).toEqual(expectedResult);
  });

  test("kyberTokens", async () => {
    const result = await kyberTokens();
    expect(result).toMatchSnapshot();
  });
});
