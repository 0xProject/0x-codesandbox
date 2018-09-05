declare module '*.json' {
    const value: any;
    export default value;
}

declare module 'react-toast-notifications';

interface Token {
    name: string;
    address: string;
    symbol: string;
    decimals: number;
    isTradeable: boolean;
    isMintable: boolean;
}

interface TokenBalanceAllowance {
    token: Token;
    balance: BigNumber;
    allowance: BigNumber;
}
