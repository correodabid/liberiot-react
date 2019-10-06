
import React, { Component } from "react";
import { Row, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import Gateway from "../models/gateway.model";
import moment from "moment";


type IProps = {
    gateways: Array<Gateway>;
}

type IState = {

}

export class GatewaysTable extends Component<IProps, IState> {
    render() {
        const { gateways } = this.props;

        const columns: Array<ColumnProps<Gateway>> = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'MAC address',
            dataIndex: 'secret',
            key: 'secret',
        },
        {
            title: 'Last connection',
            dataIndex: 'last_connection',
            key: 'last_connection',
            render: (text: string, record: Gateway) => (
                <span>
                    {record.last_connection ? moment().to(record.last_connection) : '-'}
                </span>
            ),
        }];

        return (
            <Row>
                <Table rowKey="_id" pagination={{ size: 'small' }} columns={columns} dataSource={gateways} />
            </Row>
        )
    }
}