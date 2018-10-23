import { BigNumber } from '@0x/utils';
import { Field, PanelBlock, Tag } from 'bloomer';
import * as React from 'react';

interface Props {
    gasUsed?: number;
    revertReason?: string;
    value?: BigNumber;
}

export class TxInfo extends React.Component<Props, {}> {
    public render(): React.ReactNode {
        return (
            <PanelBlock style={{ marginBottom: '1px' }}>
                <Field isGrouped={true} hasAddons={true}>
                    {this.props.revertReason ? (
                        <div className="control tags has-addons">
                            <Tag isColor="danger">Revert</Tag>
                            <Tag isColor="white"> {this.props.revertReason} </Tag>
                        </div>
                    ) : (
                        <div className="control tags has-addons">
                            <Tag isColor="success">Success</Tag>
                        </div>
                    )}
                    {this.props.gasUsed && (
                        <div className="control tags has-addons">
                            <Tag isColor="light">Gas Used</Tag>
                            <Tag isColor="white">{this.props.gasUsed}</Tag>
                        </div>
                    )}
                    {this.props.value && (
                        <div className="control tags has-addons">
                            <Tag isColor="light">Value (wei)</Tag>
                            <Tag isColor="white">{this.props.value.toString()}</Tag>
                        </div>
                    )}
                    <div />
                </Field>
            </PanelBlock>
        );
    }
}
