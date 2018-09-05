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
    3: {
        ZRX: {
            ...tokens.ZRX,
            address: '0xff67881f8d12f372d91baae9752eb3631ff0ed00',
        },
        MKR: {
            ...tokens.MKR,
            address: '0x06732516acd125b6e83c127752ed5f027e1b276e',
        },
        GNT: {
            ...tokens.GNT,
            address: '0x7f8acc55a359ca4517c30510566ac35b800f7cac',
        },
        REP: {
            ...tokens.REP,
            address: '0xb0b443fe0e8a04c4c85e8fda9c5c1ccc057d6653',
        },
        WETH: {
            ...tokens.WETH,
            address: '0xc778417e063141139fce010982780140aa0cd5ab',
        },
    },
    42: {
        ZRX: {
            ...tokens.ZRX,
            address: '0x2002d3812f58e35f0ea1ffbf80a75a38c32175fa',
        },
        MKR: {
            ...tokens.MKR,
            address: '0x7b6b10caa9e8e9552ba72638ea5b47c25afea1f3',
        },
        GNT: {
            ...tokens.GNT,
            address: '0x31fb614e223706f15d0d3c5f4b08bdf0d5c78623',
        },
        REP: {
            ...tokens.REP,
            address: '0x8cb3971b8eb709c14616bd556ff6683019e90d9c',
        },
        WETH: {
            ...tokens.WETH,
            address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
        },
    },
};
