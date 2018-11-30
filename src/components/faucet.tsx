import { Web3Wrapper } from '@0x/web3-wrapper';
import { Button, Content, Control, Subtitle } from 'bloomer';
import * as React from 'react';

interface Props {
    web3Wrapper: Web3Wrapper;
}

export class Faucet extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }
    public render(): React.ReactNode {
        return (
            <Content style={{ marginTop: '20px' }}>
                <Subtitle isSize={6}>Faucet</Subtitle>
                <p>
                    {' '}
                    Faucets will dispense ETH to your account on the test network. Once wrapped (into WETH) this will
                    allow you to begin exchanging for ERC20 tokens.
                </p>
                <Control>
                    <Button isSize="small" id="dispenseETH" onClick={this.dispenseETH} isColor="primary">
                        Dispense ETH
                    </Button>
                </Control>
            </Content>
        );
    }
    public dispenseETH = async (): Promise<void> => {
        const addresses = await this.props.web3Wrapper.getAvailableAddressesAsync();
        const address = addresses[0];
        const url = `https://faucet.0xproject.com/ether/${address}`;
        await fetch(url);
        console.log('Dispense ETH requested');
    }
}
