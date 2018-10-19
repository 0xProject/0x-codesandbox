import { ContractWrappers } from '0x.js';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Column, Columns, Content, Panel, PanelTabs, Subtitle } from 'bloomer';
import * as _ from 'lodash';
import * as React from 'react';

import { CancelOrder } from './zeroex_actions/cancel_order';
import { CreateOrder } from './zeroex_actions/create_order';
import { FillOrder } from './zeroex_actions/fill_order';
import { GetOrderInfo } from './zeroex_actions/order_info';
import { WrapEth } from './zeroex_actions/wrap_eth';

interface Props {
    contractWrappers: ContractWrappers;
    web3Wrapper: Web3Wrapper;
    toastManager: { add: (msg: string, appearance: {}) => void };
}

enum FormType {
    CREATE = 'Create',
    FILL = 'Fill',
    CANCEL = 'Cancel',
    WRAP_ETH = 'Wrap ETH',
    GET_ORDER_INFO = 'Order Info',
}
interface ZeroExActionsState {
    selectedForm: FormType;
}

export class ZeroExActions extends React.Component<Props, ZeroExActionsState> {
    public state = { selectedForm: FormType.CREATE };
    public onTxSubmitted = async (txHash: string) => {
        const { toastManager, web3Wrapper } = this.props;
        if (txHash) {
            toastManager.add(`Transaction Submitted: ${txHash}`, {
                appearance: 'success',
                autoDismiss: true,
            });
            const receipt = await web3Wrapper.awaitTransactionMinedAsync(txHash);
            const appearance = receipt.status === 1 ? 'success' : 'error';
            toastManager.add(`Transaction Mined: ${txHash}`, {
                appearance,
                autoDismiss: true,
            });
        }
    }
    public render(): React.ReactNode {
        const { selectedForm } = this.state;
        const { web3Wrapper, contractWrappers } = this.props;
        const defaultProps = { web3Wrapper, contractWrappers, onTxSubmitted: this.onTxSubmitted };
        let currentFormRender;
        switch (selectedForm) {
            case FormType.CREATE:
                currentFormRender = <CreateOrder {...defaultProps} />;
                break;
            case FormType.CANCEL:
                currentFormRender = <CancelOrder {...defaultProps} />;
                break;
            case FormType.FILL:
                currentFormRender = <FillOrder {...defaultProps} />;
                break;
            case FormType.WRAP_ETH:
                currentFormRender = <WrapEth {...defaultProps} />;
                break;
            case FormType.GET_ORDER_INFO:
                currentFormRender = <GetOrderInfo {...defaultProps} />;
                break;
            default:
                currentFormRender = <div />;
                break;
        }
        const panelTabsRender = _.map(Object.keys(FormType), formType => {
            const type = FormType[formType];
            const isActive = selectedForm === type;
            const className = isActive ? 'is-active' : '';
            return (
                <a key={type} onClick={() => this.setState({ selectedForm: type })} className={className}>
                    {type}
                </a>
            );
        });
        return (
            <Content>
                <Subtitle isSize={6}>Try 0x.js</Subtitle>
                <p> Below are common examples of 0x.js actions you will come across when creating your dApp </p>
                <Columns>
                    <Column isSize={{ mobile: 11, default: 7 }}>
                        <Panel>
                            <PanelTabs>{panelTabsRender}</PanelTabs>
                            {currentFormRender}
                        </Panel>
                    </Column>
                </Columns>
            </Content>
        );
    }
}
