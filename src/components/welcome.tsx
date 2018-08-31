import { Content } from 'bloomer';
import * as React from 'react';

interface Props {}

export class Welcome extends React.Component<Props, {}> {
    public render(): React.ReactNode {
        return (
            <Content>
                The 0x sandbox provides a runnable example of how to use and interact with 0x. Be sure to check out the{' '}
                <a href="https://github.com/0xProject/0x-starter-project/">0x starter project</a> for more examples and
                scenarios. Our <a href="https://0xproject.com/portal">Portal</a> provides a user on-boarding flow to get
                you started with the 0x ecosystem. Documentation for 0x.js can be found on our{' '}
                <a href="https://0xproject.com/docs/0xjs">website</a>.
            </Content>
        );
    }
}
