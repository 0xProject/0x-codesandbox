import { Field, FieldLabel, Label, PanelBlock, Tag } from 'bloomer';
import * as React from 'react';

interface Props {
    reason: string;
}

export class GenericError extends React.Component<Props, {}> {
    public render(): React.ReactNode {
        return (
            <PanelBlock>
                <Field>
                    <FieldLabel style={{ textAlign: 'left' }}>
                        <Label>
                            <Tag isColor="danger">Error</Tag>
                        </Label>
                        {this.props.reason}
                    </FieldLabel>
                </Field>
            </PanelBlock>
        );
    }
}
