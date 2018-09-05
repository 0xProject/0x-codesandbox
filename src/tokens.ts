export const TOKENS = {
    ZRX: {
        name: '0x Protocol Token',
        decimals: 18,
        symbol: 'ZRX',
        isTradeable: true,
        isMintable: true,
    },
    MKR: {
        name: 'Maker DAO',
        decimals: 18,
        symbol: 'MKR',
        isTradeable: true,
        isMintable: true,
    },
    GNT: {
        name: 'Golem Network Token',
        decimals: 18,
        symbol: 'GNT',
        isTradeable: true,
        isMintable: true,
    },
    REP: {
        name: 'Augur Reputation Token',
        decimals: 18,
        symbol: 'REP',
        isTradeable: true,
        isMintable: true,
    },
    WETH: {
        name: 'Wrapped ETH',
        decimals: 18,
        symbol: 'WETH',
        isTradeable: true,
        isMintable: false,
    },
};
export const ETHER_TOKEN: Token = {
    name: 'Ether',
    address: '0x0',
    decimals: 18,
    symbol: 'ETH',
    isTradeable: false,
    isMintable: false,
};
export const TOKENS_BY_NETWORK: { [networkId: number]: { [tokenSymbol: string]: Token } } = {
    3: {
        ZRX: {
            ...TOKENS.ZRX,
            address: '0xff67881f8d12f372d91baae9752eb3631ff0ed00',
        },
        MKR: {
            ...TOKENS.MKR,
            address: '0x06732516acd125b6e83c127752ed5f027e1b276e',
        },
        GNT: {
            ...TOKENS.GNT,
            address: '0x7f8acc55a359ca4517c30510566ac35b800f7cac',
        },
        REP: {
            ...TOKENS.REP,
            address: '0xb0b443fe0e8a04c4c85e8fda9c5c1ccc057d6653',
        },
        WETH: {
            ...TOKENS.WETH,
            address: '0xc778417e063141139fce010982780140aa0cd5ab',
        },
    },
    42: {
        ZRX: {
            ...TOKENS.ZRX,
            address: '0x2002d3812f58e35f0ea1ffbf80a75a38c32175fa',
        },
        MKR: {
            ...TOKENS.MKR,
            address: '0x7b6b10caa9e8e9552ba72638ea5b47c25afea1f3',
        },
        GNT: {
            ...TOKENS.GNT,
            address: '0x31fb614e223706f15d0d3c5f4b08bdf0d5c78623',
        },
        REP: {
            ...TOKENS.REP,
            address: '0x8cb3971b8eb709c14616bd556ff6683019e90d9c',
        },
        WETH: {
            ...TOKENS.WETH,
            address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
        },
    },
};
