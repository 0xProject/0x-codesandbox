import { BaseContract } from '@0x/base-contract';
import { ContractWrappers } from '@0x/contract-wrappers';
import { Order } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { CallData, DecodedLogArgs, LogWithDecodedArgs, TransactionReceiptWithDecodedLogs } from 'ethereum-types';
import { rawDecode } from 'ethereumjs-abi';
import * as ethers from 'ethers';
import * as _ from 'lodash';

import { parseJSONSignedOrder } from '../../../utils';

export interface DecodedInputData {
    input: any;
    decodedInput?: any;
    functionSignature?: string;
    isDecoded: boolean;
}

export interface ExplainedTransaction {
    success: boolean;
    txHash: string;
    decodedInput: DecodedInputData;
    decodedLogs?: Array<LogWithDecodedArgs<DecodedLogArgs>>;
    revertReason: string | undefined;
    gasUsed?: number;
    value?: BigNumber;
}

export const ERROR_PREFIX = '08c379a0';
export const txExplainerUtils = {
    async explainTransactionAsync(
        web3Wrapper: Web3Wrapper,
        contractWrappers: ContractWrappers,
        txHash: string,
    ): Promise<ExplainedTransaction> {
        const tx = await web3Wrapper.getTransactionByHashAsync(txHash);
        const txReceipt = await web3Wrapper.getTransactionReceiptAsync(txHash);
        if (!tx || !tx.blockNumber || !tx.input) {
            throw new Error('Transaction not found or not mined');
        }
        const callData: CallData = {
            from: tx.from,
            to: tx.to as string,
            nonce: parseInt(tx.nonce.toString(), 16),
            data: tx.input,
            value: new BigNumber(tx.value, 16),
        };
        const blockNumber = parseInt(tx.blockNumber.toString(), 16);
        const exchangeContract: BaseContract = await (contractWrappers.exchange as any)._getExchangeContractAsync();
        let decodedInput = await txExplainerUtils.decodeInputParamsAsync(exchangeContract, callData);
        if (!decodedInput.isDecoded) {
            const forwarderContract: BaseContract = await (contractWrappers.forwarder as any)._getForwarderContractAsync();
            decodedInput = await txExplainerUtils.decodeInputParamsAsync(forwarderContract, callData);
        }
        let decodedLogs;
        let revertReason;
        let gasUsed;
        const isSuccess = txReceipt && txReceipt.status === 1;
        if (txReceipt && txReceipt.status === 1) {
            decodedLogs = await txExplainerUtils.decodeLogsAsync(web3Wrapper, txReceipt);
            gasUsed = parseInt(txReceipt.gasUsed.toString(), 16);
        } else {
            // Make a call at that blockNumber to check for any revert reasons
            revertReason = await txExplainerUtils.decodeRevertReasonAsync(web3Wrapper, callData, blockNumber);
        }
        const value = new BigNumber(tx.value, 16);
        return {
            success: isSuccess,
            txHash,
            value,
            gasUsed,
            decodedInput,
            decodedLogs,
            revertReason,
        };
    },
    async decodeRevertReasonAsync(
        web3Wrapper: Web3Wrapper,
        callData: CallData,
        blockNumber: number,
    ): Promise<string | undefined> {
        let result;
        try {
            result = await web3Wrapper.callAsync(callData, blockNumber);
        } catch (e) {
            // Handle the case where an error is thrown as "Reverted <revert with reason>" i.e Parity via RPCSubprovider
            const errorPrefixIndex = e.data.indexOf(ERROR_PREFIX);
            if (errorPrefixIndex >= 0) {
                const resultRaw = e.data.slice(errorPrefixIndex);
                result = `0x${resultRaw}`;
            }
        }
        if (!_.isUndefined(result)) {
            const returnData = Buffer.from(result.slice(2), 'hex');
            if (returnData && returnData.slice(0, 4).toString('hex') === ERROR_PREFIX) {
                const reason = rawDecode(['string'], returnData.slice(4))[0];
                return reason;
            }
        }
        return undefined;
    },
    async decodeLogsAsync(
        web3Wrapper: Web3Wrapper,
        txReceipt: TransactionReceiptWithDecodedLogs,
    ): Promise<Array<LogWithDecodedArgs<DecodedLogArgs>>> {
        // Extract the logs
        const decodedLogs: Array<LogWithDecodedArgs<DecodedLogArgs>> = [];
        for (const log of txReceipt.logs) {
            const decodedLog = web3Wrapper.abiDecoder.tryToDecodeLogOrNoop(log);
            // tslint:disable:no-unnecessary-type-assertion
            decodedLogs.push(decodedLog as LogWithDecodedArgs<DecodedLogArgs>);
        }
        return decodedLogs;
    },
    async decodeInputParamsAsync(contract: BaseContract, callData: CallData): Promise<DecodedInputData> {
        let calledEthersFunction;
        const decodeErrorResult = {
            input: callData.data,
            isDecoded: false,
            decodedInput: undefined,
            functionSignature: undefined,
        };
        if (_.isUndefined(callData.data)) {
            return decodeErrorResult;
        }
        const calledMethod = callData.data.slice(0, 10);
        const ethersInterfaces = (contract as any)._ethersInterfacesByFunctionSignature;
        if (_.isUndefined(ethersInterfaces)) {
            throw new Error('Contract not supported');
        }
        for (const k of Object.keys(ethersInterfaces)) {
            const functions = ethersInterfaces[k].functions;
            for (const f of Object.keys(functions)) {
                const sighash = functions[f].sighash;
                if (sighash === calledMethod) {
                    calledEthersFunction = functions[f];
                    const decodedInput = ethers.utils.defaultAbiCoder.decode(
                        calledEthersFunction.inputs,
                        `0x${callData.data.slice(10)}`,
                    );
                    const namedInputKeys = _.filter(Object.keys(decodedInput), arg => !new RegExp(/^\d+$/).test(arg));
                    const namedInput = {};
                    for (const namedInputKey of namedInputKeys) {
                        namedInput[namedInputKey] = decodedInput[namedInputKey];
                    }
                    const normalizedInput = namedInputKeys.length > 0 ? namedInput : decodedInput;
                    return {
                        input: callData,
                        decodedInput: normalizedInput,
                        functionSignature: calledEthersFunction.signature,
                        isDecoded: true,
                    };
                }
            }
        }
        return decodeErrorResult;
    },
    _convertEthersOrder(orderRaw: any, exchangeAddress: string): Order {
        const order: Order = {
            makerAddress: orderRaw.makerAddress.toLowerCase(),
            takerAddress: orderRaw.takerAddress.toLowerCase(),
            makerAssetAmount: orderRaw.makerAssetAmount.toString(),
            takerAssetAmount: orderRaw.takerAssetAmount.toString(),
            makerFee: orderRaw.makerFee.toString(),
            takerFee: orderRaw.takerFee.toString(),
            expirationTimeSeconds: orderRaw.expirationTimeSeconds.toString(),
            salt: orderRaw.salt.toString(),
            makerAssetData: orderRaw.makerAssetData,
            takerAssetData: orderRaw.takerAssetData,
            senderAddress: orderRaw.senderAddress.toLowerCase(),
            feeRecipientAddress: orderRaw.feeRecipientAddress.toLowerCase(),
            exchangeAddress,
        };
        const orderJSON = JSON.stringify(order, null, 2);
        return parseJSONSignedOrder(orderJSON);
    },
};
