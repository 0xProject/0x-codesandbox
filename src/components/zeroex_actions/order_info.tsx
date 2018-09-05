import { ContractWrappers, orderHashUtils, OrderInfo, OrderStatus } from '0x.js';
import { Button, Input, PanelBlock, TextArea } from 'bloomer';
import * as React from 'react';

import { parseJSONSignedOrder } from '../../utils';
import { OpenModule } from '../open_module';
import { PanelBlockField } from '../panel_block_field';

interface Props {
    contractWrappers: ContractWrappers;
    onTxSubmitted: (txHash: string) => void;
}

interface OrderInfoState {
    order?: string;
    orderInfo?: OrderInfo;
    orderHash?: string;
}

export class GetOrderInfo extends React.Component<Props, OrderInfoState> {
    public async getInfoAsync() {
        const { order } = this.state;
        const { contractWrappers } = this.props;
        if (order) {
            // Parse the Order JSON into types (converting into BigNumber)
            const signedOrder = parseJSONSignedOrder(order);
            // Generate the Order Hash for the order
            const orderHashHex = orderHashUtils.getOrderHashHex(signedOrder);
            // call getOrderInfo on the Exchange contract
            const orderInfo = await contractWrappers.exchange.getOrderInfoAsync(signedOrder);
            this.setState(prev => ({ ...prev, orderHash: orderHashHex, orderInfo }));
        }
    }
    public render(): React.ReactNode {
        const orderInfoRender =
            this.state && this.state.orderInfo ? (
                <div>
                    <PanelBlockField label="Hash">
                        <Input value={this.state.orderHash} readOnly={true} />
                    </PanelBlockField>
                    <PanelBlockField label="Status">{OrderStatus[this.state.orderInfo.orderStatus]}</PanelBlockField>
                    <PanelBlockField label="Filled Amount">
                        {this.state.orderInfo.orderTakerAssetFilledAmount.toString()}
                    </PanelBlockField>
                </div>
            ) : (
                <div />
            );
        return (
            <div>
                <PanelBlock>
                    <div>
                        Retrieve information about the Order from the Exchange contract.
                        <OpenModule filePath="/src/components/zeroex_actions/order_info.tsx" lineNumber={21} />
                    </div>
                </PanelBlock>
                <PanelBlockField label="Order">
                    <TextArea
                        type="text"
                        placeholder="Order"
                        onChange={e => {
                            const value = (e.target as any).value;
                            this.setState(prevState => ({ ...prevState, order: value }));
                        }}
                    />
                </PanelBlockField>
                {orderInfoRender}
                <PanelBlock>
                    <Button onClick={this.getInfoAsync.bind(this)} isFullWidth={true} isSize="small" isColor="primary">
                        Get Order Info
                    </Button>
                </PanelBlock>
            </div>
        );
    }
}
