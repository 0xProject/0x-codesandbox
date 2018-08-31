import { BigNumber, ERC20TokenWrapper } from '0x.js';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { Button, Column, Columns, Content, Icon, Subtitle, Table } from 'bloomer';
import * as _ from 'lodash';
import * as React from 'react';

import { ETHER_TOKEN, tokensByNetwork } from '../tokens';

interface Props {
    web3Wrapper: Web3Wrapper;
    erc20TokenWrapper: ERC20TokenWrapper;
    toastManager: { add: (msg: string, appearance: {}) => void };
}

interface Token {
    name: string;
    address: string;
    symbol: string;
    decimals: number;
}
interface TokenBalanceAllowance {
    token: Token;
    balance: BigNumber;
    allowance: BigNumber;
    tradeable: boolean;
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
        }, 2000);
    }
    public fetchAccountDetailsAsync = async () => {
        const { web3Wrapper, erc20TokenWrapper } = this.props;
        const { balances } = this.state;
        const addresses = await web3Wrapper.getAvailableAddressesAsync();
        const address = addresses[0];
        if (!address) {
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
                return { token, balance: numberBalance, allowance, tradeable: true };
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
                tradeable: false,
            } as TokenBalanceAllowance,
        ];

        // Update the state in React
        this.setState(prev => {
            const prevSelectedAccount = prev.selectedAccount;
            const selectedAccount = prevSelectedAccount !== address ? address : prevSelectedAccount;
            return { ...prev, balances, selectedAccount };
        });
    }
    public checkAccountChangeAsync = async () => {
        const { web3Wrapper } = this.props;
        const { selectedAccount } = this.state;
        const addresses = await web3Wrapper.getAvailableAddressesAsync();
        const address = addresses[0];
        if (!address) {
            return;
        }
        if (selectedAccount !== address) {
            const balances = {};
            this.setState(prev => ({ ...prev, balances, selectedAccount }));
            void this.fetchAccountDetailsAsync();
        }
    }
    public setProxyAllowanceAsync = async (tokenAddress: string) => {
        const { erc20TokenWrapper } = this.props;
        const { selectedAccount } = this.state;
        const txHash = await erc20TokenWrapper.setUnlimitedProxyAllowanceAsync(tokenAddress, selectedAccount);
        void this.transactionSubmittedAsync(txHash);
    }
    public transactionSubmittedAsync = async (txHash: string) => {
        const { toastManager, web3Wrapper } = this.props;
        console.log(txHash);
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
        console.log(receipt);
        await this.fetchAccountDetailsAsync();
    }
    public render(): React.ReactNode {
        const { balances, selectedAccount } = this.state;
        const accountBalances = balances[selectedAccount];
        const fetchBalancesButton = (
            <Button isSize="small" isColor="info" id="fetchAccountBalances" onClick={this.fetchAccountDetailsAsync}>
                Fetch Balances
            </Button>
        );
        let contentRender = (
            <div>
                <strong>Fetching Balances...</strong>
            </div>
        );

        if (accountBalances) {
            const balancesString = _.map(accountBalances, (tokenBalance: TokenBalanceAllowance) => {
                const { name, symbol } = tokenBalance.token;
                // Convert to the human readable amount based off the token decimals
                const balance = Web3Wrapper.toUnitAmount(tokenBalance.balance, tokenBalance.token.decimals);
                const balanceRender = balance.toFixed(4);
                const allowanceRender = this.renderAllowanceForTokenBalance(tokenBalance);
                return (
                    <tr key={name}>
                        <td>{symbol}</td>
                        <td>{balanceRender}</td>
                        <td>{allowanceRender}</td>
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
                <Icon isSize="small" className="fa fa-lock" />) indicates that this token is not tradeable on 0x, to
                unlock the token click the lock icon. The tick icon ({' '}
                <Icon isSize="small" className="fa fa-check-circle" style={{ color: 'rgb(77, 197, 92)' }} /> ) indicates
                that this token is tradeable on 0x.
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
        if (tokenBalance.tradeable) {
            allowanceRender = tokenBalance.allowance.greaterThan(0) ? (
                <Icon isSize="small" className="fa fa-check-circle" style={{ color: 'rgb(77, 197, 92)' }} />
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
}
