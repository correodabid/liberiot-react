
import React, { Component } from "react";
import { PageHeader } from "antd";
import { History } from "history";

type IProps = {
    title?: string;
    description: string;
    history?: History,
    extra?: React.ReactNode
}

export class TitlePageComponent extends Component<IProps> {
    render() {
        const { title, description, history, extra } = this.props;

        return (
            <div >
                {
                    history ?
                        <PageHeader data-test="backButton" onBack={() => history.goBack()} title={title} subTitle={description} extra={extra} />
                        :
                        <PageHeader data-test="noBackButton" title={title} subTitle={description} extra={extra} />
                }
            </div>
        )
    }
}