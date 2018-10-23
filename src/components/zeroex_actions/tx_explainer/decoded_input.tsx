import { Field, FieldBody, FieldLabel, Input, Label, PanelBlock, Table, Tag } from 'bloomer';
import * as _ from 'lodash';
import * as React from 'react';

import { DecodedInputData } from './utils';

interface Props {
    decodedInput: DecodedInputData;
}

export class DecodedInput extends React.Component<Props, {}> {
    public renderSingleInputRow(value: any, key: string, prefix: string = ''): React.ReactNode {
        return (
            <tr key={`${prefix}-${key}`}>
                <td className="is-small">{_.join(_.compact([prefix, key]), '-')}</td>
                <td>
                    <div>{value.toString()}</div>
                </td>
            </tr>
        );
    }
    public renderInputRow(value: any, key: string, prefix: string = ''): React.ReactNode | React.ReactNode[] {
        if (_.isArray(value)) {
            const namedInputKeys = _.filter(Object.keys(value), arg => !new RegExp(/^\d+$/).test(arg));
            let rows;
            // tslint:disable-next-line:prefer-conditional-expression
            if (namedInputKeys.length > 0) {
                rows = _.map(namedInputKeys, (v, i) => this.renderInputRow(value[v], `${key}.${v}`, prefix));
            } else {
                rows = _.map(value, (v, i) => this.renderInputRow(v, `${key}[${i}]`, prefix));
            }
            const flattenedRows = _.flatten(rows);
            return [
                <tr key={key}>
                    <td>
                        <strong>{key}</strong>
                    </td>
                </tr>,
                ...flattenedRows,
            ];
        } else {
            return this.renderSingleInputRow(value, key, prefix);
        }
    }
    public renderInput(decodedInput: any): React.ReactNode {
        return (
            <div className="table-container">
                <Table isFullWidth={true}>
                    <tbody>
                        {_.flatten(
                            _.map(Object.keys(decodedInput), input => this.renderInputRow(decodedInput[input], input)),
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }
    public render(): React.ReactNode {
        const { functionSignature, decodedInput } = this.props.decodedInput;
        return (
            <div>
                <p className="panel-heading" style={{ marginBottom: '0px' }}>
                    Input
                </p>
                <PanelBlock>
                    <Field>
                        <FieldLabel style={{ textAlign: 'left' }}>
                            <Label>
                                <Tag isColor="white">Function</Tag>
                            </Label>
                            <Input
                                type="text"
                                placeholder="Function Signature"
                                value={functionSignature}
                                isSize={'small'}
                                readOnly={true}
                                style={{ borderColor: '#fff' }}
                            />
                        </FieldLabel>
                    </Field>
                    <Field>
                        <Label>
                            <Tag isColor="white">Arguments</Tag>
                        </Label>
                        <FieldBody>{this.renderInput(decodedInput)}</FieldBody>
                    </Field>
                </PanelBlock>
            </div>
        );
    }
}
