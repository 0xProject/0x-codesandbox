import { ContractWrappers } from '@0x/contract-wrappers';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Button, Input, PanelBlock } from 'bloomer';
import * as _ from 'lodash';
import * as React from 'react';

import { PanelBlockField } from '../panel_block_field';

import { DecodedInput } from './tx_explainer/decoded_input';
import { DecodedLogs } from './tx_explainer/decoded_logs';
import { GenericError } from './tx_explainer/generic_error';
import { TxInfo } from './tx_explainer/tx_info';
import { ExplainedTransaction, txExplainerUtils } from './tx_explainer/utils';

interface Props {
    contractWrappers: ContractWrappers;
    web3Wrapper: Web3Wrapper;
}

interface TxExplainerState {
    txHash: string;
    explainedTransaction?: ExplainedTransaction;
    error?: string;
}

export class TxExplainer extends React.Component<Props, TxExplainerState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            txHash: '0x',
        };
    }
    public async explainTransactionAsync(): Promise<void> {
        const { txHash } = this.state;
        try {
            const explainedTransaction = await txExplainerUtils.explainTransactionAsync(
                this.props.web3Wrapper,
                this.props.contractWrappers,
                txHash,
            );
            this.setState({ explainedTransaction });
        } catch (e) {
            this.setState({ error: e.message });
        }
    }
    public render(): React.ReactNode {
        const { explainedTransaction, error } = this.state;
        const decodedLogsRender =
            explainedTransaction && explainedTransaction.decodedLogs ? (
                <DecodedLogs logs={explainedTransaction.decodedLogs} />
            ) : (
                <div />
            );
        const decodedInputRender =
            explainedTransaction && explainedTransaction.decodedInput && explainedTransaction.decodedInput.isDecoded ? (
                <DecodedInput decodedInput={explainedTransaction.decodedInput} />
            ) : (
                <div />
            );
        const txInfoRender = explainedTransaction ? (
            <TxInfo
                gasUsed={explainedTransaction.gasUsed}
                revertReason={explainedTransaction.revertReason}
                value={explainedTransaction.value}
            />
        ) : (
            <div />
        );
        const genericErrorRender = !_.isUndefined(error) ? <GenericError reason={error} /> : <div />;
        return (
            <div>
                <PanelBlock>
                    <div>Explains the transaction</div>
                </PanelBlock>
                <PanelBlockField label="Tx Hash">
                    <Input
                        type="text"
                        placeholder="Tx Hash"
                        value={this.state.txHash ? this.state.txHash : ''}
                        onChange={e => {
                            const value = (e.target as any).value;
                            this.setState(prevState => ({ ...prevState, txHash: value }));
                        }}
                    />
                </PanelBlockField>
                <PanelBlock>
                    <Button
                        isFullWidth={true}
                        isSize="small"
                        isColor="primary"
                        onClick={this.explainTransactionAsync.bind(this)}
                    >
                        Explain tx
                        {true}
                    </Button>
                </PanelBlock>
                {genericErrorRender}
                {txInfoRender}
                {decodedInputRender}
                {decodedLogsRender}
            </div>
        );
    }
}
