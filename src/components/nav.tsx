import { Web3Wrapper } from '@0x/web3-wrapper';
import { Image, Navbar, NavbarBrand, NavbarItem, Tag } from 'bloomer';
import * as React from 'react';

interface NavState {
    networkId?: number;
}
interface NavProps {
    web3Wrapper?: Web3Wrapper;
}
enum Network {
    Mainnet = 'Mainnet',
    Ropsten = 'Ropsten',
    Kovan = 'Kovan',
    Rinkeby = 'Rinkeby',
    Unknown = 'Unknown',
}
const networkIdToNetwork = {
    1: Network.Mainnet,
    3: Network.Ropsten,
    4: Network.Rinkeby,
    42: Network.Kovan,
    50: Network.Unknown,
};
export class Nav extends React.Component<NavProps, NavState> {
    public state = { networkId: undefined };
    constructor(props: NavProps) {
        super(props);
        void this.fetchNetworkDetailsAsync();
    }
    public async fetchNetworkDetailsAsync() {
        const { web3Wrapper } = this.props;
        if (web3Wrapper) {
            const networkId = await web3Wrapper.getNetworkIdAsync();
            if (networkId !== this.state.networkId) {
                this.setState({ networkId });
            }
        }
    }
    public renderNetworkIndicator(): React.ReactNode {
        const { networkId } = this.state;
        if (networkId) {
            const networkName = networkIdToNetwork[networkId] || Network.Unknown;
            if (networkName === Network.Unknown || networkName === Network.Mainnet) {
                return <Tag isColor="warning">{networkName} - Please connect to a test network</Tag>;
            }
            return <Tag isColor="primary">{networkName}</Tag>;
        }
        return <Tag isColor="danger">Disconnected</Tag>;
    }
    public render(): React.ReactNode {
        const networkRender = this.renderNetworkIndicator();
        return (
            <Navbar style={{ zIndex: -1 }}>
                <NavbarBrand>
                    <NavbarItem>
                        <Image
                            isSize="16x16"
                            src="https://0xproject.com/images/favicon/favicon-2-32x32.png"
                            style={{ marginLeft: 0, marginRight: 10 }}
                        />
                        <strong> 0x Sandbox </strong>
                        <NavbarItem>{networkRender}</NavbarItem>
                    </NavbarItem>
                </NavbarBrand>
            </Navbar>
        );
    }
}
