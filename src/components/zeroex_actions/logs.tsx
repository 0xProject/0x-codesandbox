import { ExchangeEventArgs, ExchangeEvents, WETH9Events } from '@0x/abi-gen-wrappers';
import { ContractWrappers, DecodedLogEvent } from '@0x/contract-wrappers';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { PanelBlock, Tag } from 'bloomer';
import * as _ from 'lodash';
import * as React from 'react';

interface Props {
    contractWrappers: ContractWrappers;
    web3Wrapper: Web3Wrapper;
}

interface LogsState {
    logs: Array<DecodedLogEvent<ExchangeEventArgs>>;
}

export class Logs extends React.Component<Props, LogsState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            logs: [],
        };
        void this.fetchInitialLogsAsync();
        const { exchange, etherToken, forwarder } = this.props.contractWrappers;
        exchange.subscribe(ExchangeEvents.Fill, {}, this.handleLog.bind(this));
        exchange.subscribe(ExchangeEvents.Cancel, {}, this.handleLog.bind(this));
        exchange.subscribe(ExchangeEvents.CancelUpTo, {}, this.handleLog.bind(this));
        const etherTokenAddress = forwarder.etherTokenAddress;
        if (etherTokenAddress) {
            etherToken.subscribe(etherTokenAddress, WETH9Events.Deposit, {}, this.handleLog.bind(this));
            etherToken.subscribe(etherTokenAddress, WETH9Events.Withdrawal, {}, this.handleLog.bind(this));
            etherToken.subscribe(etherTokenAddress, WETH9Events.Approval, {}, this.handleLog.bind(this));
            etherToken.subscribe(etherTokenAddress, WETH9Events.Transfer, {}, this.handleLog.bind(this));
        }
    }
    public async fetchInitialLogsAsync(): Promise<void> {
        // const { exchange } = this.props.contractWrappers;
        // const blockNumber = await this.props.web3Wrapper.getBlockNumberAsync();
        // const pastBlockNumber = blockNumber - 100;
        // const blockRange = { fromBlock: pastBlockNumber, toBlock: blockNumber };
        // const fillLogs = await exchange.getLogsAsync(ExchangeEvents.Fill, blockRange, {});
        // _.map(fillLogs, log => {
        //     this.handleLog(null, { log } as any);
        // });
        // const cancelLogs = await exchange.getLogsAsync(ExchangeEvents.Cancel, blockRange, {});
        // _.map(cancelLogs, log => {
        //     this.handleLog(null, { log } as any);
        // });
    }
    public handleLog(err: Error | null, log?: DecodedLogEvent<ExchangeEventArgs>): void {
        if (log) {
            const { logs } = this.state;
            const newLogs = [log, ...logs];
            this.setState({ logs: newLogs });
        }
    }
    public render(): React.ReactNode {
        const { logs } = this.state;
        const logRender = _.map(logs, log => {
            const eventTagColor = log.log.event === ExchangeEvents.Fill ? 'primary' : 'warning';
            return (
                <div key={`${log.log.transactionHash}-${log.log.logIndex}`}>
                    <div>
                        <Tag isColor="white" style={{ fontFamily: 'monospace' }}>
                            {log.log.transactionHash.substr(0, 10)}
                        </Tag>{' '}
                        <Tag isColor={eventTagColor}>{log.log.event}</Tag>
                        <Tag isColor="white">{log.log.blockNumber}</Tag>
                    </div>
                </div>
            );
        });

        return (
            <div>
                <PanelBlock>
                    <div>Logs from the contracts</div>
                </PanelBlock>
                <PanelBlock>{logRender}</PanelBlock>
            </div>
        );
    }
}
