
import React, { Component } from "react";
import { Button, } from "antd";
import { History } from "history";

interface IProps {
    history?: History
}

type IState = {
}

export class GoBackComponent extends Component<IProps, IState> {

    render() {
        const { history } = this.props;

        return (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                {history && <Button shape="round" icon="left" onClick={() => history.goBack()}>Back</Button>}
            </div>
        )
    }
}