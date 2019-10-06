import React from "react";
import Clipboard from "clipboard";
import { Icon, message } from "antd";

type IProps = {
    value: string
}

type IState = {

}

export default class ClipboardComponent extends React.Component<IProps, IState>{
    button: any = {};
    input: any = {};
    clipboard: any = {};

    componentDidMount() {
        this.clipboard = new Clipboard(this.button, { target: () => this.input })
    }

    componentWillUnmount() {
        this.clipboard.destroy()
    }

    onCopy() {
        message.success('Copied!', 10)
    }

    render() {
        const { value } = this.props;

        return (
            <div className='clipboard'>
                <div className='label'>Secret key</div>
                <input ref={(element) => this.input = element} value={value} readOnly className="ant-input input" />
                <button className="ant-btn" ref={(element) => this.button = element} onClick={this.onCopy}>
                    <Icon type="copy" />
                </button>
            </div>
        )
    }
}
