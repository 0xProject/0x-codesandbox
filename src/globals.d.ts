declare module '*.json' {
    const value: any;
    export default value;
}

declare module 'react-toast-notifications';
declare module 'ethereumjs-abi';
declare module 'web3-provider-engine/subproviders/cache';

interface Token {
    name: string;
    address: string;
    symbol: string;
    decimals: number;
    isTradeable: boolean;
    isMintable: boolean;
    image: string;
}

interface TokenBalanceAllowance {
    token: Token;
    balance: BigNumber;
    allowance: BigNumber;
}
