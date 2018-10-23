import { Field, FieldBody, FieldLabel, Label, PanelBlock, Table, Tag } from 'bloomer';
import { DecodedLogArgs, LogWithDecodedArgs } from 'ethereum-types';
import * as _ from 'lodash';
import * as React from 'react';

interface Props {
    logs: Array<LogWithDecodedArgs<DecodedLogArgs>>;
}

export class DecodedLogs extends React.Component<Props, {}> {
    public renderLog(log: LogWithDecodedArgs<DecodedLogArgs>): React.ReactNode {
        const isDecoded = !!log.event;
        return (
            <Field key={(log.logIndex as number).toString()}>
                <FieldLabel style={{ textAlign: 'left' }}>
                    <Label>
                        <Tag isColor="info">{isDecoded ? log.event : 'Unknown'}</Tag>
                        <Tag isColor="white">{log.address}</Tag>
                    </Label>
                </FieldLabel>
                <FieldBody>
                    {isDecoded ? (
                        <div className="table-container">
                            <Table isFullWidth={true}>
                                <tbody>
                                    {!_.isUndefined(log.args) ? (
                                        _.map(Object.keys(log.args), k => (
                                            <tr key={k}>
                                                <td className="is-small">{k}</td>
                                                <td>
                                                    <div>{log.args[k].toString()}</div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr />
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <hr />
                    )}
                </FieldBody>
            </Field>
        );
    }
    public render(): React.ReactNode {
        const decodedLogsRender = (
            <div>
                <p className="panel-heading" style={{ marginBottom: '0px' }}>
                    Events
                </p>
                <PanelBlock>{_.map(this.props.logs, log => this.renderLog(log))}</PanelBlock>
            </div>
        );
        return decodedLogsRender;
    }
}
