import { Web3ProviderEngine, RPCSubprovider, ZeroEx } from '0x.js';
import { SignerSubprovider } from '@0xproject/subproviders';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ToastProvider, withToastManager } from 'react-toast-notifications';
import Welcome from './Welcome';
import Account from './Account';
import Web3Actions from './Web3Actions';
import Faucet from './Faucet';
import { Nav } from './Nav';
import InstallMetamask from './InstallMetamask';
import { Content } from 'bloomer';

// Kovan is a test network
// Please ensure you have Metamask installed
// and it is connected to the Kovan test network
const KOVAN_NETWORK_ID = 42;
const KOVAN_RPC = 'https://kovan.infura.io';

const styles = {};

const AccountWithToasts = withToastManager(Account);
const App = () => {
    // Detect if Web3 is found, if not, ask the user to install Metamask
    if ((window as any).web3) {
        const web3 = (window as any).web3;
        console.log('web3', web3);
        // Set up Web3 Provider Engine with a few helper Subproviders from 0x
        const providerEngine = new Web3ProviderEngine({ pollingInterval: 10000 });
        // All signing based requests till go to the SignerSubprovider
        providerEngine.addProvider(new SignerSubprovider(web3.currentProvider));
        // All other requests will fall through to the next subprovider, such as data requests
        providerEngine.addProvider(new RPCSubprovider(KOVAN_RPC));
        providerEngine.start();
        console.log('providerEngine', providerEngine);

        // Initialize 0x.js with the web3 current provider and provide it the network
        const zeroEx = new ZeroEx(providerEngine, { networkId: KOVAN_NETWORK_ID });

        // Browse the individual files for more handy examples
        return (
            <div style={styles}>
                <Nav />
                <Content style={{ marginLeft: '20px' }}>
                    <Welcome />
                    <ToastProvider>
                        <AccountWithToasts zeroEx={zeroEx} />
                    </ToastProvider>
                    <Faucet zeroEx={zeroEx} />
                    <Web3Actions zeroEx={zeroEx} />
                </Content>
            </div>
        );
    } else {
        return (
            <div style={styles}>
                <Nav />
                <Content>
                    <InstallMetamask />
                </Content>
            </div>
        );
    }
};

const e = React.createElement;
const main = document.getElementById('app');
if (main) {
    ReactDOM.render(e(App), main);
} else {
    console.log('Cannot find main container');
}
