import { ContractWrappers, orderHashUtils, OrderStatus } from '0x.js';
import { Button, PanelBlock, TextArea } from 'bloomer';
import * as React from 'react';

import { parseJSONSignedOrder } from '../../utils';
import { OpenModule } from '../open_module';
import { PanelBlockField } from '../panel_block_field';

interface Props {
    contractWrappers: ContractWrappers;
    onTxSubmitted: (txHash: string) => void;
}

interface CancelOrderState {
    orderJSON?: string;
}

export class CancelOrder extends React.Component<Props, CancelOrderState> {
    public async cancelOrderAsync() {
        const { orderJSON } = this.state;
        const { contractWrappers, onTxSubmitted } = this.props;
        if (orderJSON) {
            // Parse the Order JSON into types (converting into BigNumber)
            const signedOrder = parseJSONSignedOrder(orderJSON);
            // Retrieve the order info, only cancel fillable orders
            const orderInfo = await contractWrappers.exchange.getOrderInfoAsync(signedOrder);
            if (orderInfo.orderStatus === OrderStatus.FILLABLE) {
                // Call Cancel Order on the Exchange contract
                const txHash = await contractWrappers.exchange.cancelOrderAsync(signedOrder);
                if (txHash) {
                    onTxSubmitted(txHash);
                }
            } else {
                // Generate the Order Hash for this order
                const orderHashHex = orderHashUtils.getOrderHashHex(signedOrder);
                console.log('Order already filled or cancelled: ', orderHashHex);
            }
        }
    }
    public render(): React.ReactNode {
        return (
            <div>
                <PanelBlock>
                    <div>
                        Orders natuarally expire after the specified expiry time has passed. To cancel an order which
                        has not passed the expiry time, it must be cancelled on chain by calling cancelOrder.
                        <OpenModule filePath="/src/components/zeroex_actions/cancel_order.tsx" lineNumber={19} />
                    </div>
                </PanelBlock>
                <PanelBlockField label="Order">
                    <TextArea type="text" placeholder="Order" onChange={this.onOrderChange.bind(this)} />
                </PanelBlockField>
                <PanelBlock>
                    <Button
                        onClick={this.cancelOrderAsync.bind(this)}
                        isFullWidth={true}
                        isSize="small"
                        isColor="primary"
                    >
                        Cancel Order
                    </Button>
                </PanelBlock>
            </div>
        );
    }
    public onOrderChange(e: any) {
        const value = e.target.value;
        this.setState(prevState => ({ ...prevState, orderJSON: value }));
    }
}
