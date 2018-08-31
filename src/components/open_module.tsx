import { actions, dispatch } from 'codesandbox-api';
import * as React from 'react';

interface Props {
    filePath: string;
    lineNumber?: number;
}

export class OpenModule extends React.Component<Props, {}> {
    public render(): React.ReactNode {
        return <a onClick={this.onClick}> View code.</a>;
    }
    public onClick = () => dispatch(actions.editor.openModule(this.props.filePath, this.props.lineNumber));
}
