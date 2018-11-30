export const TOKENS = {
    ZRX: {
        name: '0x Protocol Token',
        decimals: 18,
        symbol: 'ZRX',
        isTradeable: true,
        isMintable: true,
        image: 'https://0xproject.com/images/token_icons/ZRX.png',
    },
    MKR: {
        name: 'Maker DAO',
        decimals: 18,
        symbol: 'MKR',
        isTradeable: true,
        isMintable: true,
        image: 'https://0xproject.com/images/token_icons/MKR.png',
    },
    GNT: {
        name: 'Golem Network Token',
        decimals: 18,
        symbol: 'GNT',
        isTradeable: true,
        isMintable: true,
        image: 'https://0xproject.com/images/token_icons/GNT.png',
    },
    REP: {
        name: 'Augur Reputation Token',
        decimals: 18,
        symbol: 'REP',
        isTradeable: true,
        isMintable: true,
        image: 'https://0xproject.com/images/token_icons/REP.png',
    },
    WETH: {
        name: 'Wrapped ETH',
        decimals: 18,
        symbol: 'WETH',
        isTradeable: true,
        isMintable: false,
        image: 'https://0xproject.com/images/token_icons/WETH.png',
    },
};
export const ETHER_TOKEN: Token = {
    name: 'Ether',
    address: '0x0',
    decimals: 18,
    symbol: 'ETH',
    isTradeable: false,
    isMintable: false,
    image: 'https://0xproject.com/images/ether.png',
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
    4: {
        ZRX: {
            ...TOKENS.ZRX,
            address: '0x8080c7e4b81ecf23aa6f877cfbfd9b0c228c6ffa',
        },
        MKR: {
            ...TOKENS.MKR,
            address: '0x175ac784563de645647c6350f0cfc577dcc7ee5b',
        },
        GNT: {
            ...TOKENS.GNT,
            address: '0xa47aa5fcecbfb374e79144f05fdf91d0f50fa351',
        },
        REP: {
            ...TOKENS.REP,
            address: '0x2d1420f4cee004c348d58e7b28869af8c5372323',
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
    50: {
        ZRX: {
            ...TOKENS.ZRX,
            address: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            isMintable: false,
        },
        MKR: {
            ...TOKENS.MKR,
            address: '0x6dfff22588be9b3ef8cf0ad6dc9b84796f9fb45f',
        },
        GNT: {
            ...TOKENS.GNT,
            address: '0xcfc18cec799fbd1793b5c43e773c98d4d61cc2db',
        },
        REP: {
            ...TOKENS.REP,
            address: '0xf22469f31527adc53284441bae1665a7b9214dba',
        },
        WETH: {
            ...TOKENS.WETH,
            address: '0x0b1ba0af832d7c05fd64161e0db78e85978e8082',
        },
    },
};
