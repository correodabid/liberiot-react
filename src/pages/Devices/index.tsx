import React, { Component } from "react";
import { NavLink, RouteComponentProps, Link } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { Table, Icon, Divider, Modal, Card, Switch, Button } from "antd";
import { ColumnProps } from "antd/lib/table";
import moment from 'moment';

import { TitlePageComponent, LiberiotBreadcrumbs } from "../../components";
import "./devices.scss";

import { AuthStore, DeviceStore } from "../../stores";

import Device from "../../models/device.model";
import Project from "../../models/project.model";

interface ILocationState {
    title: string;
}
interface IMatchParams {
    projectId: string;
    organizationId: string;
}

interface IProps extends RouteComponentProps<IMatchParams, any, ILocationState> {
    AuthStore: AuthStore
    DeviceStore: DeviceStore
}

interface IState {
    key: string,
    showChangeStateModal: boolean;
}

@inject('AuthStore', 'DeviceStore')
@observer
export default class DevicesPage extends Component<IProps, IState> {
    columns: Array<ColumnProps<Device>> = [];

    constructor(props: IProps) {
        super(props);

        this.state = {
            key: 'dev',
            showChangeStateModal: false,
        };

        this.columns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Mac', dataIndex: 'mac', key: 'mac' },
            { title: 'UUID', dataIndex: 'uuid', key: 'uuid' },
            {
                title: 'Last connection', dataIndex: 'last_connection', key: 'last_connection',
                render: (text: Date) => text ? moment().to(text) : ''
            },
            {
                title: 'Action', key: 'action', className: 'nowrap',
                render: (text: any, record: Device) => (
                    <span>
                        {record.is_enabled &&
                            <span>
                                <NavLink to={`/devices/${record._id}`}><Icon type="eye" /></NavLink>
                                {
                                    this.props.AuthStore.selectedProfile.is_admin && <span>
                                        <Divider type='vertical' />
                                        <NavLink to={`${this.props.match.url}/${record._id}/edit`}><Icon type="edit" /></NavLink>
                                    </span>
                                }
                                <Divider type='vertical' />
                                <NavLink to={`${this.props.match.url}/${record._id}/api`}><Icon type="api" /></NavLink>
                                <Divider type='vertical' />
                                <span className="link"><Icon type="delete" onClick={() => this.deleteDevice(record)} /></span>

                            </span>
                        }
                    </span>
                )
            },
            {
                title: 'Enabled', dataIndex: 'is_enabled', key: 'is_enabled', align: 'right',
                render: (text: boolean, record: Device) => (
                    record &&
                    <Switch checked={record.is_enabled}
                        onChange={(checked: boolean) => this.onSetSwitch({ ...record, is_enabled: checked })} />
                )
            },
        ];

        if (!this.props.match.params.projectId) {
            this.columns.splice(3, 0, {
                title: 'Project', dataIndex: 'project', key: 'project',
                render: (text: any, record: Device) => (
                    record.project && <NavLink to={`/project/${(record.project as Project)._id}`}>{(record.project as Project).name}</NavLink>
                )
            });
        }
    }

    onSetSwitch(device: Device) {
        this.setState({ showChangeStateModal: true })
        this.props.DeviceStore.setDeviceSelected(device)
    }

    componentDidMount() {
        this.getDevices();
    }

    componentWillUnmount() {
        Modal.destroyAll();
    }

    onChangeState = async () => {
        const { selectedDevice, editDevice } = this.props.DeviceStore
        await editDevice(selectedDevice);
        await this.setState({ showChangeStateModal: false })
        this.getDevices();
    }

    getDevices = async () => {
        this.props.DeviceStore.getDevices({ project: this.props.match.params.projectId });
    }

    onTabChange = async (key: any, type: any) => {
        await this.setState({ key: key })
    }

    deleteDevice = async (device: Device): Promise<void> => {
        Modal.confirm({
            title: `Are you sure you want to destroy this device?`,
            okText: `Yes, destroy`,
            cancelText: 'Cancel',
            maskClosable: true,
            onOk: async () => {
                if (device && device._id) {
                    await this.props.DeviceStore.deleteDevice(device._id);
                    this.getDevices();
                }
            }
        });
    }

    render() {
        const { showChangeStateModal }: { showChangeStateModal: boolean } = this.state;
        const { isLoading, devices, selectedDevice } = this.props.DeviceStore
        const { location } = this.props;

        return (
            <div id="devices">
                <LiberiotBreadcrumbs {...this.props} />
                <Card tabList={[{ key: 'dev', tab: 'Development' }, { key: 'prod', tab: 'Production' }]}
                    onTabChange={(key) => { this.onTabChange(key, 'key'); }}
                    activeTabKey={this.state.key}>
                    <TitlePageComponent title='Devices'
                        description={`List of your devices in ${location.state && location.state.title}.`}
                        extra={[
                            !this.props.match.params.projectId && <Link to={`${this.props.match.url}/new`} key='new'>
                                <Button shape='round' icon='plus' type='primary' />
                            </Link>
                        ]}
                    />
                    <Table rowKey={(row: Device, index: number) => row._id || index.toString()}
                        columns={this.columns}
                        dataSource={devices.docs.filter((device: Device) => this.state.key === 'dev' ? !device.is_production : device.is_production)}
                        loading={isLoading}
                        rowClassName={(record, index) => !record.is_enabled ? 'disabled-row' : ''}
                        pagination={{ hideOnSinglePage: true, size: 'small' }} />
                </Card>
                {showChangeStateModal &&
                    <Modal
                        title={`Change ${selectedDevice.name} state?`}
                        visible={showChangeStateModal}
                        footer={null}
                        onCancel={() => this.setState({ showChangeStateModal: false })}
                    >
                        <div style={{ margin: '2em', textAlign: 'center' }}>
                            <p> Are you sure you want to change the state of this device?</p>
                            <Button className='save-button' shape="round" onClick={this.onChangeState} >
                                Change state
                            </Button>
                            <Button style={{ marginLeft: '.5em' }} shape="round" onClick={() => this.setState({ showChangeStateModal: false })} >
                                Cancel
                            </Button>
                        </div>
                    </Modal>
                }
            </div>
        )
    }
}

export * from './detail';
export * from './edit';
export * from './add';