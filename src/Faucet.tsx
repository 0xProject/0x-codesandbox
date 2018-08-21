import * as React from 'react';
import { ZeroEx } from '0x.js';
import { Button, Content, Columns, Column } from 'bloomer';

interface Props {
    zeroEx: ZeroEx;
}

export default class Faucet extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }
    render() {
        return (
            <Content style={{ marginTop: '20px' }}>
                <h2> Testnet Faucets </h2>
                <p>
                    {' '}
                    Faucets will dispense ETH and ZRX tokens to your account on the test network. This will allow you to
                    begin exchanging ERC20 tokens.
                </p>
                <Button id="dispenseETH" onClick={this.dispenseETH} isColor="primary">
                    Dispense ETH
                </Button>
                <Button style={{ marginLeft: '10px' }} id="dispenseZRX" onClick={this.dispenseZRX} isColor="primary">
                    Dispense ZRX
                </Button>
                {/* <p style={{ marginTop: '10px' }}>
                    0x.js is for exchange, to perform an exchange of ZRX for WETH click the button below.
                    <br />
                    This will generate an order from our Faucet (who will be the maker) and you will submit the order to
                    the blockchain (and therefor be the taker).
                    <br />
                    After the transaction confirms on the blockchain, you should notice a change in your balance of WETH
                    (+0.1) and ZRX (-0.1) <br />
                    For 0x to make an exchange on your behalf, you must first Allow the 0x exchange contract for each
                    ERC20 Token. Allowance settings can be found on the{' '}
                    <a href="https://0xproject.com/portal/balances">Portal</a>.
                </p> */}
                {/* <button id="orderWETH" onClick={this.orderWETH.bind(this)}>
                    Exchange ZRX/WETH
                </button> */}
            </Content>
        );
    }
    dispenseZRX = async (): Promise<void> => {
        const addresses = await this.props.zeroEx.getAvailableAddressesAsync();
        const address = addresses[0];
        const url = `https://faucet.0xproject.com/zrx/${address}`;
        await fetch(url);
        console.log('Dispense ZRX requested');
    }
    dispenseETH = async (): Promise<void> => {
        const addresses = await this.props.zeroEx.getAvailableAddressesAsync();
        const address = addresses[0];
        const url = `https://faucet.0xproject.com/ether/${address}`;
        await fetch(url);
        console.log('Dispense ETH requested');
    }
    // private async orderWETH(): Promise<void> {
    //     const addresses = await this.props.zeroEx.getAvailableAddressesAsync();
    //     const address = addresses[0];
    //     const url = `https://faucet.0xproject.com/order/weth/${address}`;
    //     const response = await fetch(url);
    //     const bodyJson = await response.json();

    //     const signedOrder: SignedOrder = relayerResponseJsonParsers.parseOrderJson(bodyJson);
    //     console.log(signedOrder);

    //     const fillAmount = ZeroEx.toBaseUnitAmount(signedOrder.takerTokenAmount, 18);
    //     try {
    //         await this.props.zeroEx.exchange.fillOrderAsync(signedOrder, fillAmount, true, address);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }
}
