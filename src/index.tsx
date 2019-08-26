import { ContractWrappers, MetamaskSubprovider, RPCSubprovider, Web3ProviderEngine } from '0x.js';
import { SignerSubprovider } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Content, Footer } from 'bloomer';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ToastProvider, withToastManager } from 'react-toast-notifications';

import { Account } from './components/account';
import { Faucet } from './components/faucet';
import { InstallMetamask } from './components/install_metamask';
import { Nav } from './components/nav';
import { Welcome } from './components/welcome';
import { ZeroExActions } from './components/zeroex_actions';
import { networkToRPCURI } from './utils';

interface AppState {
    web3Wrapper?: Web3Wrapper;
    contractWrappers?: ContractWrappers;
    web3?: any;
}

export class MainApp extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        void this._initializeWeb3Async();
    }
    public render(): React.ReactNode {
        const AccountWithNotifications = withToastManager(Account);
        const ZeroExActionsWithNotifications = withToastManager(ZeroExActions);
        if (!this.state || !this.state.contractWrappers || !this.state.web3Wrapper) {
            return <div />;
        }
        return (
            <div style={{ paddingLeft: 30, paddingRight: 30, paddingBottom: 30 }}>
                <Nav web3Wrapper={this.state.web3Wrapper} />
                <Content className="container">
                    {this.state.web3 && (
                        <div>
                            <Welcome />
                            <ToastProvider>
                                <AccountWithNotifications web3Wrapper={this.state.web3Wrapper} />
                                <ZeroExActionsWithNotifications
                                    contractWrappers={this.state.contractWrappers}
                                    web3Wrapper={this.state.web3Wrapper}
                                />
                                <Faucet web3Wrapper={this.state.web3Wrapper} />
                            </ToastProvider>
                        </div>
                    )}
                    {!this.state.web3 && <InstallMetamask />}
                </Content>
                <Footer />
            </div>
        );
    }
    private async _initializeWeb3Async(): Promise<void> {
        let injectedProviderIfExists = (window as any).ethereum;
        if (injectedProviderIfExists !== undefined) {
            if (injectedProviderIfExists.enable !== undefined) {
                try {
                    await injectedProviderIfExists.enable();
                } catch (err) {
                    console.log(err);
                }
            }
        } else {
            const injectedWeb3IfExists = (window as any).web3;
            if (injectedWeb3IfExists !== undefined && injectedWeb3IfExists.currentProvider !== undefined) {
                injectedProviderIfExists = injectedWeb3IfExists.currentProvider;
            } else {
                return undefined;
            }
        }
        if (injectedProviderIfExists) {
            // Wrap Metamask in a compatibility wrapper as some of the behaviour
            // differs
            const networkId = await new Web3Wrapper(injectedProviderIfExists).getNetworkIdAsync();
            const signerProvider =
                injectedProviderIfExists.isMetaMask || injectedProviderIfExists.isToshi
                    ? new MetamaskSubprovider(injectedProviderIfExists)
                    : new SignerSubprovider(injectedProviderIfExists);
            const provider = new Web3ProviderEngine();
            provider.addProvider(signerProvider);
            provider.addProvider(new RPCSubprovider(networkToRPCURI[networkId]));
            provider.start();
            const web3Wrapper = new Web3Wrapper(provider);
            const contractWrappers = new ContractWrappers(provider, { networkId });
            // Load all of the ABI's into the ABI decoder so logs are decoded
            // and human readable
            _.map([contractWrappers.exchange.abi, contractWrappers.weth9.abi, contractWrappers.forwarder.abi], abi =>
                web3Wrapper.abiDecoder.addABI(abi),
            );
            this.setState({ web3Wrapper, contractWrappers, web3: injectedProviderIfExists });
        }
    }
}

const e = React.createElement;
const main = document.getElementById('app');
ReactDOM.render(e(MainApp), main);
