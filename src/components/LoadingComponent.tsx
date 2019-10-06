import React, { Component } from "react";
import { Spin } from "antd";



interface IProps {

}

interface IState {
}

export class LoadingComponent extends Component<IProps, IState> {

    render() {

        return (
            <div style={{ textAlign: 'center' }}>
                <Spin tip="Loading..." />
            </div>
        )
    }
}