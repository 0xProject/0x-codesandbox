import { BigNumber, SignedOrder } from '0x.js';

export function parseJSONSignedOrder(order: string): SignedOrder {
    const signedOrder = JSON.parse(order);
    signedOrder.salt = new BigNumber(signedOrder.salt);
    signedOrder.makerAssetAmount = new BigNumber(signedOrder.makerAssetAmount);
    signedOrder.takerAssetAmount = new BigNumber(signedOrder.takerAssetAmount);
    signedOrder.makerFee = new BigNumber(signedOrder.makerFee);
    signedOrder.takerFee = new BigNumber(signedOrder.takerFee);
    signedOrder.expirationTimeSeconds = new BigNumber(signedOrder.expirationTimeSeconds);
    return signedOrder;
}
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ZERO = new BigNumber(0);
