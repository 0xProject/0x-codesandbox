import { Field, FieldBody, FieldLabel, Label, PanelBlock } from 'bloomer';
import * as React from 'react';

interface Props {
    label: string;
}

export class PanelBlockField extends React.Component<Props, {}> {
    public render(): React.ReactNode {
        return (
            <PanelBlock>
                <Field isHorizontal={true}>
                    <FieldLabel>
                        <Label>{this.props.label}</Label>
                    </FieldLabel>
                    <FieldBody>{this.props.children}</FieldBody>
                </Field>
            </PanelBlock>
        );
    }
}
