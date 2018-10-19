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
                    Faucets will dispense ETH and ZRX tokens to your account on the test network. This will allow you to
                    begin exchanging ERC20 tokens.
                </p>
                <Control>
                    <Button isSize="small" id="dispenseETH" onClick={this.dispenseETH} isColor="primary">
                        Dispense ETH
                    </Button>
                    <Button
                        isSize="small"
                        style={{ marginLeft: '10px' }}
                        id="dispenseZRX"
                        onClick={this.dispenseZRX}
                        isColor="primary"
                    >
                        Dispense ZRX
                    </Button>
                </Control>
            </Content>
        );
    }
    public dispenseZRX = async (): Promise<void> => {
        const addresses = await this.props.web3Wrapper.getAvailableAddressesAsync();
        const address = addresses[0];
        const url = `https://faucet.0xproject.com/zrx/${address}`;
        await fetch(url);
        console.log('Dispense ZRX requested');
    }
    public dispenseETH = async (): Promise<void> => {
        const addresses = await this.props.web3Wrapper.getAvailableAddressesAsync();
        const address = addresses[0];
        const url = `https://faucet.0xproject.com/ether/${address}`;
        await fetch(url);
        console.log('Dispense ETH requested');
    }
}
