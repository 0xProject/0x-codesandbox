import * as React from 'react';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { ZeroEx } from '0x.js';
import { Button } from 'bloomer';

interface Props {
    zeroEx: ZeroEx;
}

interface Web3ActionsState {
    signedData: string;
}

export default class Web3Actions extends React.Component<Props, Web3ActionsState> {
    private _web3Wrapper: Web3Wrapper;
    constructor(props: Props) {
        super(props);
        this.state = { signedData: '' };
        this._web3Wrapper = new Web3Wrapper(this.props.zeroEx.getProvider());
    }
    render() {
        const msg = '0x.js sandbox!';
        const signMessage = async () => {
            const { zeroEx } = this.props;
            const addresses = await zeroEx.getAvailableAddressesAsync();
            const address = addresses[0];
            if (!address) {
                return;
            }
            try {
                console.log('sign data');
                const signed = await this._web3Wrapper.signMessageAsync(address, msg);
                this.setState(prevState => {
                    return { ...prevState, signedData: signed };
                });
            } catch (e) {
                console.log('sign error');
                console.log(e);
            }
        };
        const { signedData } = this.state;
        return (
            <div>
                <h2>Additional Web3 Actions</h2>
                <p> These are examples of other web3 actions you may come across when creating your dApp </p>
                <Button id="personalSignButton" onClick={signMessage}>
                    Sign Message
                </Button>
                <p>{signedData}</p>
            </div>
        );
    }
}
