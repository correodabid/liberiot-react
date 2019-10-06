
import React, { Component } from "react";
import { Row, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import Device from "../models/device.model";
import { Link } from "react-router-dom";


type IProps = {
    devices: Array<Device>
}

type IState = {

}

export class DevicesTable extends Component<IProps, IState> {

    render() {
        const { devices } = this.props

        const columns: Array<ColumnProps<Device>> = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',

            render: (text: any, record: Device) => <Link to={`/devices/${record._id}`}>{text}</Link>
        },
        { title: 'Mac', dataIndex: 'mac', key: 'mac' },
        { title: 'UUID', dataIndex: 'uuid', key: 'uuid' },
            // {
            //     title: 'Commands',
            //     dataIndex: 'actions',
            //     key: 'actions',
            //     render: (text: string, record: Device) => (
            //         <span>
            //             <a href="/" >See Commands</a>
            //         </span>
            //     ),
            // }
        ];

        if (devices.length === 0) return null

        return (
            <Row data-test="devicesTable">
                <Table rowKey="_id" pagination={{ size: 'small' }} columns={columns} dataSource={devices} />
            </Row>
        )
    }
}