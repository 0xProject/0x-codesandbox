import { BigNumber, ERC20TokenWrapper } from '0x.js';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { Button, Column, Columns, Content, Icon, Subtitle, Table } from 'bloomer';
import * as _ from 'lodash';
import * as React from 'react';

import { artifacts } from '../artifacts';
import { DummyERC20TokenContract } from '../contract_wrappers/dummy_erc20_token';
import { ETHER_TOKEN, tokensByNetwork } from '../tokens';

const ACCOUNT_CHECK_INTERVAL_MS = 2000;
const MAX_MINTABLE_AMOUNT = new BigNumber('10000000000000000000000');
const GREEN = 'rgb(77, 197, 92)';

interface Props {
    web3Wrapper: Web3Wrapper;
    erc20TokenWrapper: ERC20TokenWrapper;
    toastManager: { add: (msg: string, appearance: {}) => void };
}

interface AccountState {
    balances: { [address: string]: TokenBalanceAllowance[] };
    selectedAccount: string;
}

export class Account extends React.Component<Props, AccountState> {
    constructor(props: Props) {
        super(props);
        this.state = { balances: {}, selectedAccount: '' };
        void this.fetchAccountDetailsAsync();
        setInterval(() => {
            void this.checkAccountChangeAsync();
        }, ACCOUNT_CHECK_INTERVAL_MS);
    }
    public async fetchAccountDetailsAsync() {
        const { web3Wrapper, erc20TokenWrapper } = this.props;
        const { balances } = this.state;
        const addresses = await web3Wrapper.getAvailableAddressesAsync();
        const address = addresses[0];
        if (_.isUndefined(address)) {
            return;
        }
        const networkId = await web3Wrapper.getNetworkIdAsync();
        const tokens = tokensByNetwork[networkId];
        // Fetch all the Balances for all of the tokens
        const allBalancesAsync = _.map(
            tokens,
            async (token: Token): Promise<TokenBalanceAllowance> => {
                const balance = await erc20TokenWrapper.getBalanceAsync(token.address, address);
                const allowance = await erc20TokenWrapper.getProxyAllowanceAsync(token.address, address);
                const numberBalance = new BigNumber(balance);
                return { token, balance: numberBalance, allowance };
            },
        );

        const results = await Promise.all(allBalancesAsync);
        balances[address] = results;
        // Fetch the Balance of Ether
        const weiBalance = await web3Wrapper.getBalanceInWeiAsync(address);
        balances[address] = [
            ...balances[address],
            {
                token: ETHER_TOKEN,
                balance: weiBalance,
                allowance: new BigNumber(0),
            } as TokenBalanceAllowance,
        ];

        this.setState(prev => {
            const prevSelectedAccount = prev.selectedAccount;
            const selectedAccount = prevSelectedAccount !== address ? address : prevSelectedAccount;
            return { ...prev, balances, selectedAccount };
        });
    }
    public async checkAccountChangeAsync() {
        const { web3Wrapper } = this.props;
        const { selectedAccount } = this.state;
        const addresses = await web3Wrapper.getAvailableAddressesAsync();
        const address = addresses[0];
        if (_.isUndefined(address)) {
            return;
        }
        if (selectedAccount !== address) {
            const balances = {};
            this.setState(prev => ({ ...prev, balances, selectedAccount }));
            void this.fetchAccountDetailsAsync();
        }
    }
    public async setProxyAllowanceAsync(tokenAddress: string) {
        const { erc20TokenWrapper } = this.props;
        const { selectedAccount } = this.state;
        const txHash = await erc20TokenWrapper.setUnlimitedProxyAllowanceAsync(tokenAddress, selectedAccount);
        void this.transactionSubmittedAsync(txHash);
    }
    public async mintTokenAsync(tokenAddress: string) {
        const { selectedAccount } = this.state;
        const token = new DummyERC20TokenContract(
            artifacts.DummyERC20Token.compilerOutput.abi,
            tokenAddress,
            this.props.web3Wrapper.getProvider(),
        );
        const maxAmount = await token.MAX_MINT_AMOUNT.callAsync();
        const txHash = await token.mint.sendTransactionAsync(maxAmount, { from: selectedAccount });
        void this.transactionSubmittedAsync(txHash);
    }
    public async transactionSubmittedAsync(txHash: string) {
        const { toastManager, web3Wrapper } = this.props;
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
        await this.fetchAccountDetailsAsync();
    }
    public render(): React.ReactNode {
        const { balances, selectedAccount } = this.state;
        const accountBalances = balances[selectedAccount];
        const fetchBalancesButton = (
            <Button
                isSize="small"
                isColor="info"
                id="fetchAccountBalances"
                onClick={this.fetchAccountDetailsAsync.bind(this)}
            >
                Fetch Balances
            </Button>
        );
        let contentRender = (
            <div>
                <strong>Fetching Balances...</strong>
            </div>
        );

        if (!_.isEmpty(accountBalances)) {
            const balancesString = _.map(accountBalances, (tokenBalance: TokenBalanceAllowance) => {
                const { name, symbol } = tokenBalance.token;
                // Convert to the human readable amount based off the token decimals
                const balance = Web3Wrapper.toUnitAmount(tokenBalance.balance, tokenBalance.token.decimals);
                const balanceRender = balance.toFixed(4);
                const allowanceRender = this.renderAllowanceForTokenBalance(tokenBalance);
                const mintRender = this.renderMintForTokenBalance(tokenBalance);
                return (
                    <tr key={name}>
                        <td>{symbol}</td>
                        <td>{balanceRender}</td>
                        <td>{allowanceRender}</td>
                        <td>{mintRender}</td>
                    </tr>
                );
            });
            contentRender = (
                <div>
                    <Table>
                        <thead>
                            <tr>
                                <th>Token</th>
                                <th>Balance</th>
                                <th>Allowance</th>
                                <th>Mint</th>
                            </tr>
                        </thead>
                        <tbody>{balancesString}</tbody>
                    </Table>
                </div>
            );
        }

        return (
            <Content style={{ marginTop: '15px' }}>
                Below you will find the Account and token balances. The lock icon ({' '}
                <Icon isSize="small" className="fa fa-lock" />) indicates that this token is not isTradeable on 0x, to
                unlock the token click the lock icon. The tick icon ({' '}
                <Icon isSize="small" className="fa fa-check-circle" style={{ color: GREEN }} /> ) indicates that this
                token is isTradeable on 0x.
                <Subtitle isSize={6}>Account: {selectedAccount}</Subtitle>
                <Columns>
                    <Column isSize={3}>{contentRender}</Column>
                </Columns>
                {fetchBalancesButton}
            </Content>
        );
    }
    public renderAllowanceForTokenBalance(tokenBalance: TokenBalanceAllowance): React.ReactNode {
        let allowanceRender;
        if (tokenBalance.token.isTradeable) {
            allowanceRender = tokenBalance.allowance.greaterThan(0) ? (
                <Icon isSize="small" className="fa fa-check-circle" style={{ color: GREEN }} />
            ) : (
                <a href="#" onClick={() => void this.setProxyAllowanceAsync(tokenBalance.token.address)}>
                    <Icon isSize="small" className="fa fa-lock" />
                </a>
            );
        } else {
            allowanceRender = <div />;
        }
        return allowanceRender;
    }
    public renderMintForTokenBalance(tokenBalance: TokenBalanceAllowance): React.ReactNode {
        if (tokenBalance.token.isMintable && tokenBalance.balance.lt(MAX_MINTABLE_AMOUNT)) {
            return (
                <a href="#" onClick={() => void this.mintTokenAsync(tokenBalance.token.address)}>
                    <Icon isSize="small" className="fa fa-coins" />
                </a>
            );
        } else {
            return <div />;
        }
    }
}
