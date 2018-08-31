export const tokens = {
    ZRX: {
        name: '0x Protocol Token',
        decimals: 18,
        symbol: 'ZRX',
    },
    MKR: {
        name: 'Maker DAO',
        decimals: 18,
        symbol: 'MKR',
    },
    GNT: {
        name: 'Golem Network Token',
        decimals: 18,
        symbol: 'GNT',
    },
    REP: {
        name: 'Augur Reputation Token',
        decimals: 18,
        symbol: 'REP',
    },
    WETH: {
        name: 'Wrapped ETH',
        decimals: 18,
        symbol: 'WETH',
    },
};
export const ETHER_TOKEN = {
    name: 'Ether',
    decimals: 18,
    symbol: 'ETH',
};
export const tokensByNetwork = {
    42: {
        ZRX: {
            ...tokens.ZRX,
            address: '0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570',
        },
        MKR: {
            ...tokens.MKR,
            address: '0x1dad4783cf3fe3085c1426157ab175a6119a04ba',
        },
        GNT: {
            ...tokens.GNT,
            address: '0xef7fff64389b814a946f3e92105513705ca6b990',
        },
        REP: {
            ...tokens.REP,
            address: '0xb18845c260f680d5b9d84649638813e342e4f8c9',
        },
        WETH: {
            ...tokens.WETH,
            address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
        },
    },
};
