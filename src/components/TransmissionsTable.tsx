
import React, { Component } from "react";
import { Row, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import { IPaginationProps } from "../models/interfaces";
import Transmission from "../models/transmission.model";
import Measure from "../models/measure.model";
import { TitlePageComponent } from "./TitlePage";
import moment from "moment";

type IProps = {
    transmissions: IPaginationProps<Transmission>;
}

type IState = {

}

export class TransmissionsTable extends Component<IProps, IState> {
    render() {
        const { transmissions } = this.props;

        const columns: Array<ColumnProps<Transmission>> = [
            {
                title: 'Transmission',
                dataIndex: 'uid.full',
                key: 'uid.full',
            },
            {
                title: 'CN',
                dataIndex: 'cn',
                key: 'cn',
            },
            {
                title: 'FNC',
                dataIndex: 'fnc',
                key: 'fnc',
            },
            {
                title: 'LL',
                dataIndex: 'll',
                key: 'll',
            },
            {
                title: 'REG',
                dataIndex: 'reg',
                key: 'reg',
            },
            {
                title: 'RR',
                dataIndex: 'rr',
                key: 'rr',
            },
            {
                title: 'Date',
                dataIndex: 'created_at',
                key: 'created_at',
                render: (text: string, record: Transmission) => (
                    <span>
                        {record.created_at ? moment(record.created_at).format('DD/MM/YY HH:mm') : '-'}
                    </span>
                ),
            }];

        const nestedColumns: Array<ColumnProps<Measure>> = [{
            title: 'Endpoint',
            dataIndex: 'endpoint',
            key: 'endpoint',
        }, {
            title: 'Register',
            dataIndex: 'register',
            key: 'register',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        }];


        if (transmissions.docs.length === 0) return null

        return (
            <Row data-test="transmissionsTable">
                <TitlePageComponent title="Transmissions" description="Last 5 transmissions" />
                <Table rowKey={(record: any, index: number) => index.toString()}
                    columns={columns}
                    dataSource={transmissions.docs}
                    pagination={false}
                    rowClassName={() => 'nested-thead'}
                    expandedRowRender={(element) =>
                        <Table rowKey={(element: any, index: number) => index.toString()}
                            columns={nestedColumns}
                            dataSource={element.measures}
                            pagination={false} rowClassName={() => 'nested-thead'}
                        />
                    } />
            </Row>
        )
    }
}