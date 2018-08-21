import * as React from 'react';
import * as _ from 'lodash';
import { Card, CardHeader, CardContent, Column, Button, Icon, Columns, Notification } from 'bloomer';
import { ZeroEx, Token } from '0x.js';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { BigNumber } from '@0xproject/utils';

interface Props {
    zeroEx: ZeroEx;
    toastManager: { add: (msg: string, appearance: {}) => void };
}

interface TokenBalance {
    token: Token;
    balance: BigNumber;
    allowance: BigNumber;
}

const tokensByNetwork = {
    42: {
        ZRX: {
            name: '0x Protocol Token',
            address: '0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570',
            decimals: 18,
        },
        MKR: {
            name: 'Maker DAO',
            address: '0x1dad4783cf3fe3085c1426157ab175a6119a04ba',
            decimals: 18,
        },
        GNT: {
            name: 'Golem Network Token',
            address: '0xef7fff64389b814a946f3e92105513705ca6b990',
            decimals: 18,
        },
        REP: {
            name: 'Augur Reputation Token',
            address: '0xb18845c260f680d5b9d84649638813e342e4f8c9',
            decimals: 18,
        },
        WETH: {
            name: 'Wrapped ETH',
            address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
            decimals: 18,
        },
    },
};

type AddressTokenBalance = { [address: string]: TokenBalance[] };
interface AccountState {
    balances: AddressTokenBalance;
    accounts: string[];
}
const ETHER_TOKEN_NAME = 'ETH';
export default class Account extends React.Component<Props, AccountState> {
    private _web3Wrapper: Web3Wrapper;
    constructor(props: Props) {
        super(props);
        this.state = { accounts: [''], balances: {} };
        this._web3Wrapper = new Web3Wrapper(this.props.zeroEx.getProvider());
        this.fetchAccountDetailsAsync();
    }

    fetchAccountDetailsAsync = async () => {
        // Get the Available Addresses from the Web3 Provider inside of ZeroEx
        console.log('zeroEx', this.props.zeroEx);
        console.log('provider', this.props.zeroEx.getProvider());
        console.log('requesting available addresses');
        const addresses = await this.props.zeroEx.getAvailableAddressesAsync();
        const address = addresses[0];
        console.log('got address', address);
        if (!address) {
            return;
        }
        const networkId = await this._web3Wrapper.getNetworkIdAsync();
        console.log('got network', networkId);
        const tokens = tokensByNetwork[networkId];
        const balances = {};
        const allowances = {};
        balances[address] = {};
        allowances[address] = {};
        console.log('getting balances');
        // Fetch all the Balances for all of the tokens in the Token Registry
        const allBalancesAsync = _.map(
            tokens,
            async (token: Token): Promise<TokenBalance> => {
                try {
                    const balance = await this.props.zeroEx.erc20Token.getBalanceAsync(token.address, address);
                    const allowance = await this.props.zeroEx.erc20Token.getProxyAllowanceAsync(token.address, address);
                    const numberBalance = new BigNumber(balance);
                    return { token: token, balance: numberBalance, allowance };
                } catch (e) {
                    console.log(e);
                    const zero = new BigNumber(0);
                    return { token: token, balance: zero, allowance: zero };
                }
            },
        );

        // Convert all of the Units into more Human Readable numbers
        // Many ERC20 tokens go to 18 decimal places
        const results = await Promise.all(allBalancesAsync);
        balances[address] = results;
        // Fetch the Balance in Ether
        try {
            const ethBalance = await this._web3Wrapper.getBalanceInWeiAsync(address);
            if (ethBalance) {
                const ethBalanceNumber = new BigNumber(ethBalance);
                balances[address] = [
                    ...balances[address],
                    {
                        token: { name: ETHER_TOKEN_NAME, decimals: 18 },
                        balance: ethBalanceNumber,
                        allowance: new BigNumber(0),
                    },
                ];
            }
        } catch (e) {
            console.log(e);
        }

        // Update the state in React
        this.setState(prev => {
            return { ...prev, balances, accounts: addresses, allowances };
        });
    }
    setProxyAllowanceAsync = async (tokenAddress: string) => {
        const { zeroEx } = this.props;
        const { accounts } = this.state;
        const account = accounts[0];
        const txHash = await zeroEx.erc20Token.setUnlimitedProxyAllowanceAsync(tokenAddress, account);
        this.transactionSubmitted(txHash);
    }
    transactionSubmitted = async (txHash: string) => {
        console.log(txHash);
        this.props.toastManager.add(`Transaction Submitted: ${txHash}`, {
            appearance: 'success',
            autoDismiss: true,
        });
        const receipt = await this._web3Wrapper.awaitTransactionMinedAsync(txHash);
        const appearance = receipt.status === 1 ? 'success' : 'error';
        this.props.toastManager.add(`Transaction Mined: ${txHash}`, {
            appearance,
            autoDismiss: true,
        });
        console.log(receipt);
        this.fetchAccountDetailsAsync();
    }
    render() {
        const { accounts, balances } = this.state;
        const account = accounts[0];
        const userBalances = balances[account];
        const fetchBalancesButton = (
            <Button isColor="info" id="fetchAccountBalances" onClick={this.fetchAccountDetailsAsync}>
                Fetch Balances
            </Button>
        );
        const detectingMetamaskRender = (
            <Column isSize="1/3">
                <Card>
                    <CardHeader>
                        <strong>Detecting Metamask...</strong>
                    </CardHeader>
                    <CardContent>
                        <p> Please ensure Metamask is unlocked </p>
                        {fetchBalancesButton}
                    </CardContent>
                </Card>
            </Column>
        );

        if (userBalances) {
            const accountString = `${account}`;
            const balancesString = _.map(userBalances, (tokenBalance: TokenBalance) => {
                const name = tokenBalance.token.name;
                const balance = ZeroEx.toUnitAmount(tokenBalance.balance, tokenBalance.token.decimals);
                const allowance = ZeroEx.toUnitAmount(tokenBalance.allowance, tokenBalance.token.decimals);
                const allowanceRender = allowance.greaterThan(0) ? (
                    <Icon isSize="small" className="fa fa-check-circle" style={{ color: 'rgb(77, 197, 92)' }} />
                ) : (
                    <a href="#" onClick={() => this.setProxyAllowanceAsync(tokenBalance.token.address)}>
                        <Icon isSize="small" className="fa fa-lock" />
                    </a>
                );
                return balance ? (
                    <div key={name}>
                        <Columns>
                            <Column isSize="2/3">
                                <strong>{name}:</strong>
                            </Column>
                            <Column>
                                <p style={{ textAlign: 'right' }}>{balance.toFixed(4)}</p>
                            </Column>
                            <Column hasTextAlign="right">{allowanceRender}</Column>
                        </Columns>
                    </div>
                ) : (
                    <div />
                );
            });
            return (
                <Column isSize="1/3">
                    <Card>
                        <CardHeader>{accountString}</CardHeader>
                        <CardContent>
                            <h5> Balances </h5>
                            {balancesString}
                            {fetchBalancesButton}
                        </CardContent>
                    </Card>
                </Column>
            );
        } else {
            return detectingMetamaskRender;
        }
    }
}
