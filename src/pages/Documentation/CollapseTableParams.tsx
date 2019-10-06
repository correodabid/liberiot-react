import React from "react";
import { Table } from "antd";
import { ColumnProps } from "antd/lib/table";


type IProps = {
    data: Array<any>
}

type IState = {
}

export default class CollapseTableParams extends React.Component<IProps, IState>{

    render() {
        const { data } = this.props

        const columns: Array<ColumnProps<any>> = [
            { title: 'Name', dataIndex: 'name', key: 'name', render: (text) => (<pre>{text}</pre>) },
            { title: 'Type', dataIndex: 'type', key: 'type', render: (text) => (<pre>{text}</pre>) },
            { title: 'Default', dataIndex: 'default', key: 'default' },
            { title: 'Description', dataIndex: 'description', key: 'description' },
        ];

        // const data = [
        //     { name: 'organization', type: 'string', default: ' - ', description: 'Lorem ipsum dolor sit amet' },
        //     { name: 'project', type: 'string', default: ' - ', description: 'Lorem ipsum dolor sit amet' }
        // ]

        return (
            <div>
                <h3 style={{ margin: '.5em' }}><b>Parameters</b></h3>
                <Table rowKey={(element: any, index: number) => index.toString()}
                    pagination={false}
                    columns={columns}
                    dataSource={data} />
            </div>
        )
    }
}
