import React, { Component } from "react";
import { Button, Table, Icon, Modal } from "antd";
import Project from "../models/project.model";
import UserAvatar from "./UserAvatar";
import { inject, observer } from "mobx-react";
import { ProjectStore } from "../stores";

const confirm = Modal.confirm;
interface IProps {
    onDelete: Function;
    ProjectStore?:  ProjectStore
}

interface IState {
}


const columns = [{
    title: 'Project name',
    dataIndex: 'name',
}, {
    title: 'Members',
    dataIndex: 'members',
    render: (text: string, record: Project) => (
        <div>
            {record.members && record.members.map((element: any, index: number) =>
                <UserAvatar showTooltip={true} key={index} user={element} size={24} fontSize={"1em"} />
            )}
        </div>
    )
}];

@inject('ProjectStore')
@observer
export class ListComponent extends Component<IProps, IState> {

    state = {
        selectedRowKeys: [],
        loading: false
    }

    onSelectChange = (selectedRowKeys: any) => {
        this.setState({ selectedRowKeys });
    }

    delete = async () => {
        const { selectedRowKeys } = this.state
        confirm({
            title: 'Delete project(s)',
            content: `Are you sure you want to delete ${selectedRowKeys.length} item(s)?`,
            okType: 'danger',
            okText: 'Yes, delete',
            cancelText: 'Cancel',
            maskClosable: true,
            onOk: async () => {
                await this.setState({ loading: true })
                selectedRowKeys.forEach(async (id: string) => {
                    await this.props.ProjectStore!.editProject({ _id: id, active: false })
                })
                await this.setState({ loading: false })
                await this.props.onDelete()
            }
        });
    }

    render() {
        const { projects } = this.props.ProjectStore!;
        const { selectedRowKeys, loading } = this.state;
        const rowSelection = { selectedRowKeys, onChange: this.onSelectChange, };
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <div>
                <div style={{ marginBottom: 16 }}>
                    <Button onClick={() => this.delete()} disabled={!hasSelected} loading={loading} >
                        <Icon type="delete" /> Delete </Button>
                    <Button style={{ marginLeft: '.5em' }} onClick={() => this.props.onDelete()}  >  Cancel </Button>
                    <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                    </span>
                </div>
                <Table rowKey="_id" showHeader={false} rowSelection={rowSelection}
                    columns={columns}
                    dataSource={projects}
                    pagination={{ size: 'small' }} />
            </div>
        )
    }
}