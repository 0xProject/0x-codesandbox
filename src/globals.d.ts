declare module '*.json' {
    const value: any;
    export default value;
}

declare module 'react-toast-notifications';
declare module 'ethereumjs-abi';

type ContractWrappers = any;

interface OrderInfo {
    orderStatus: number;
    orderHash: string;
    orderTakerAssetFilledAmount: BigNumber;
}

enum OrderStatus {
    Invalid,
    InvalidMakerAssetAmount,
    InvalidTakerAssetAmount,
    Fillable,
    Expired,
    FullyFilled,
    Cancelled,
}

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

declare global {
    interface Window {
        ZeroEx: any;
    }
}

window.ZeroEx = window.ZeroEx || {};
