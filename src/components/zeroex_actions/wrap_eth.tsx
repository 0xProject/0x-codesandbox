import { BigNumber, ContractWrappers } from '0x.js';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Button, Control, Field, Input, PanelBlock } from 'bloomer';
import * as React from 'react';

import { OpenModule } from '../open_module';
import { PanelBlockField } from '../panel_block_field';

interface Props {
    contractWrappers: ContractWrappers;
    web3Wrapper: Web3Wrapper;
    onTxSubmitted: (txHash: string) => void;
}
interface WrapEthState {
    amount: string;
}

export class WrapEth extends React.Component<Props, WrapEthState> {
    constructor(props: Props) {
        super(props);
        this.state = { amount: '1' };
    }
    public wrapOrUnwrapEthAsync = async (wrap: boolean) => {
        const { web3Wrapper, contractWrappers, onTxSubmitted } = this.props;
        const { amount } = this.state;
        // Retrieve the ether token address
        const etherTokenAddress = contractWrappers.forwarder.etherTokenAddress;
        if (etherTokenAddress) {
            // List all of the available addresses
            const addresses = await web3Wrapper.getAvailableAddressesAsync();
            // The first address is one the which deposits or withdraws Eth
            const account = addresses[0];
            // Amounts are in ETH, this needs to be converted into their base unit wei
            const ethAmount = new BigNumber(amount);
            const weiAmount = Web3Wrapper.toBaseUnitAmount(ethAmount, 18);
            // Call deposit or withdraw on the ethertoken
            const txHash = wrap
                ? await contractWrappers.etherToken.depositAsync(etherTokenAddress, weiAmount, account)
                : await contractWrappers.etherToken.withdrawAsync(etherTokenAddress, weiAmount, account);
            if (txHash) {
                onTxSubmitted(txHash);
            }
        }
    }
    public render(): React.ReactNode {
        return (
            <div>
                <PanelBlock>
                    <div>
                        ETH is not an ERC20 token and it must first be wrapped to be used in 0x. ETH can be wrapped to
                        become wETH and wETH can be unwrapped retrieve ETH.
                        <OpenModule filePath="/src/components/zeroex_actions/wrap_eth.tsx" lineNumber={23} />
                    </div>
                </PanelBlock>
                <PanelBlockField label="Amount">
                    <Input
                        type="text"
                        placeholder="1"
                        value={this.state.amount}
                        onChange={this.onInputChange.bind(this)}
                    />
                </PanelBlockField>
                <PanelBlock>
                    <Field isGrouped={true} isHorizontal={true}>
                        <Control>
                            <Button
                                style={{ marginRight: '10px' }}
                                onClick={this.wrapEthAsync.bind(this)}
                                isSize="small"
                                isColor="primary"
                            >
                                Wrap
                            </Button>
                            <Button onClick={this.unwrapEthAsync.bind(this)} isSize="small" isColor="primary">
                                Unwrap
                            </Button>
                        </Control>
                    </Field>
                </PanelBlock>
            </div>
        );
    }
    public onInputChange(e: any) {
        this.setState({ amount: e.target.value });
    }
    public async wrapEthAsync() {
        void this.wrapOrUnwrapEthAsync(true);
    }
    public async unwrapEthAsync() {
        void this.wrapOrUnwrapEthAsync(false);
    }
}
