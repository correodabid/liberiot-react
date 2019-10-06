import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";
import { Divider, Icon, Modal, Card, Button, Popconfirm, Input, message, Tag } from "antd";
import Table, { ColumnProps } from "antd/lib/table";
import { inject, observer } from "mobx-react";

import { LiberiotBreadcrumbs, TitlePageComponent } from "../../components";

import ShadowDevice from "../../models/shadow-device.model";
import ShadowDeviceStore, { IQueryGetShadowDevices } from "../../stores/shadowDeviceStore";
import { AuthStore } from "../../stores";

interface ILocationState {
    title: string;
}
interface IMatchParams {
    projectId: string;
}

interface IProps extends RouteComponentProps<IMatchParams, any, ILocationState> {
    AuthStore: AuthStore;
    ShadowDeviceStore: ShadowDeviceStore;
}
interface IState {
    queryDevices?: IQueryGetShadowDevices;
    newShadow?: string;
    addVisible: boolean;
}

@inject('ShadowDeviceStore', 'AuthStore')
@observer
export default class ShadowDevicesPage extends Component<IProps, IState>{
    columns: Array<ColumnProps<ShadowDevice>> = [];

    constructor(props: IProps) {
        super(props);

        this.state = {
            addVisible: false,
            queryDevices: { project: props.match.params.projectId }
        };

        this.columns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            {
                title: 'Samples', dataIndex: 'samples', key: 'samples',
                render: (text: any, record: ShadowDevice) => {
                    if (record.samples && record.samples.length > 0)
                        return record.samples.map((sample) =>
                            <Tag key={sample._id}>
                                {sample.name}:&nbsp;{sample.type}
                            </Tag>
                        )
                    return 0
                }
            },
            {
                title: 'Action', key: 'action', className: 'nowrap',
                render: (text: any, record: ShadowDevice) => (
                    <span>
                        <NavLink to={`${this.props.match.url}/${record._id}/edit`}><Icon type="edit" /></NavLink>
                        <Divider type='vertical' />
                        <button className='link' onClick={() => this.handleDelete(record)}><Icon type="delete" /></button>
                    </span>
                )
            }
        ]
    }

    componentDidMount() {
        this.getDevices();
    }

    componentWillUnmount() {
        Modal.destroyAll();
    }

    getDevices = async () => {
        await this.props.ShadowDeviceStore.getShadowDevices(this.state.queryDevices)
    }

    handleDelete(shadowDevice: ShadowDevice) {
        Modal.confirm({
            title: 'Are you sure to delete this device?',
            content: shadowDevice.name,
            okType: 'danger',
            okText: 'Delete',
            cancelText: 'Cancel',
            maskClosable: true,
            onOk: async () => {
                if (shadowDevice._id) {
                    await this.props.ShadowDeviceStore.deleteShadowDevice(shadowDevice._id)
                    await this.getDevices()
                }
            }
        })
    }

    handleSubmit = async () => {
        const { newShadow } = this.state;

        if (newShadow) {
            await this.props.ShadowDeviceStore.addShadowDevice({
                name: newShadow,
                organization: this.props.AuthStore.selectedProfile.organization!._id,
                project: this.props.match.params.projectId
            })
            await this.getDevices();
            await this.setState({ addVisible: false })
        } else {
            message.warning('You must choose a name.')
        }
    }

    handleChangeNewShadow = (event?: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ newShadow: event ? event.target.value : undefined })
    }

    render() {
        const { shadowDevices, isLoading } = this.props.ShadowDeviceStore;
        const { location } = this.props;
        const { newShadow, addVisible } = this.state;

        return (
            <div>
                <LiberiotBreadcrumbs {...this.props} />
                <Card>
                    <TitlePageComponent title='Shadow devices' description={`List of your shadow devices in ${location.state && location.state.title}.`}
                        extra={[
                            <Popconfirm key='new' okText="Add" onConfirm={this.handleSubmit}
                                visible={addVisible}
                                onVisibleChange={(visible: boolean) => this.setState({ addVisible: visible, newShadow: undefined })}
                                title={(
                                    <span>
                                        <div>Add a new shadow device</div>
                                        <Input autoFocus value={newShadow} onChange={this.handleChangeNewShadow} onPressEnter={this.handleSubmit} />
                                    </span>
                                )}
                            >
                                <Button shape='round' icon='plus' style={{ color: '#1890ff' }} />
                            </Popconfirm>
                        ]} />
                    <Table rowKey={(row: ShadowDevice, index: number) => row._id || index.toString()}
                        columns={this.columns} dataSource={shadowDevices} loading={isLoading}
                        pagination={{ hideOnSinglePage: true, size: 'small' }} />
                </Card>
            </div>
        )
    }
}

export * from './edit';
