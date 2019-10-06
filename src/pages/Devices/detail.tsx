import React, { Component, ChangeEvent } from "react";
import { RouteComponentProps } from "react-router";
import { inject, observer } from "mobx-react";
import { Card, Button, Row, Col, Modal, Tooltip, Avatar, Table, Icon, Input } from "antd";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import moment from "moment";

import { DeviceStore, MeasureStore } from "../../stores";
import { IMeasuresParams } from "../../stores/measureStore";

import { TitlePageComponent, LoadingComponent } from "../../components";

import { Last24HoursTransmissions } from "./HeatMap";

import Measure from "../../models/measure.model";
import Project from "../../models/project.model";

type IProps = RouteComponentProps<{ deviceId: string }> & {
    DeviceStore: DeviceStore;
    MeasureStore: MeasureStore;
}

type IState = {
    isLoading: boolean;
    measuresQueryOptions: IMeasuresParams
}

@inject('DeviceStore', 'MeasureStore')
@observer
export class DeviceDetailPage extends Component<IProps, IState> {
    endpoint: any = {};

    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoading: true,
            measuresQueryOptions: {
                device: this.props.match.params.deviceId,
                populate: 'gateway organization'
            }
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillUnmount() {
        this.props.DeviceStore.removeSocket();
    }

    fetchData = async () => {
        const deviceId = this.props.match.params.deviceId;
        const { DeviceStore, MeasureStore } = this.props;
        await DeviceStore.getDevice(deviceId, { populate: true });
        this.syncTransmissions();
        await MeasureStore.getMeasures(this.state.measuresQueryOptions)
        await this.setState({ isLoading: false });
    }

    syncTransmissions = () => {
        this.props.DeviceStore.listenDeviceTransmission(() => {
            this.props.MeasureStore.getMeasures(this.state.measuresQueryOptions);
        });
    }

    removeFromProject = async () => {
        const { selectedDevice, editDevice } = this.props.DeviceStore;
        Modal.confirm({
            title: `Are you sure you want to remove this device from the project?`,
            okText: `Yes, remove`,
            cancelText: 'Cancel',
            maskClosable: true,
            onOk: async () => {
                await editDevice({ ...selectedDevice, project: undefined })
                this.props.history.goBack()
            }
        });
    }


    tableOnChange = async (pagination: PaginationConfig) => {
        await this.setState({
            measuresQueryOptions: {
                ...this.state.measuresQueryOptions,
                page: pagination.current
            }
        })
        await this.props.MeasureStore.getMeasures(this.state.measuresQueryOptions)
    }

    searchMeasuresEndpoint = async (e: ChangeEvent<HTMLInputElement>) => {
        await this.setState({ measuresQueryOptions: { ...this.state.measuresQueryOptions, endpoint: e.target.value } });
        await this.props.MeasureStore.getMeasures({ ...this.state.measuresQueryOptions, page: 1 })
    }

    render() {
        const { selectedDevice } = this.props.DeviceStore
        const { history } = this.props;
        const { isLoading, measuresQueryOptions } = this.state;
        const { measures, getMeasures } = this.props.MeasureStore;

        const columns: Array<ColumnProps<Measure>> = [
            {
                title: 'Endpoint', dataIndex: 'endpoint', key: 'endpoint',
                filterMultiple: false,
                filterDropdown: (
                    <Input.Search ref={(ele) => this.endpoint = ele} value={measuresQueryOptions.endpoint}
                        enterButton onChange={this.searchMeasuresEndpoint} onSearch={() => getMeasures({ ...measuresQueryOptions, page: 1 })} />
                ),
                filterIcon: <Icon type="search" style={{ color: measuresQueryOptions.endpoint ? '#108ee9' : '#aaa' }} />,
                onFilterDropdownVisibleChange: (visible: boolean) => visible ? setTimeout(() => this.endpoint.focus()) : null
            },
            { title: 'Value', dataIndex: 'value', key: 'value' },
            { title: 'Gateway', dataIndex: 'gateway.name', key: 'gateway.name' },
            { title: 'Date', dataIndex: 'created_at', key: 'created_at', render: (text: string) => new Date(text).toLocaleString() }
        ]

        if (isLoading) return <LoadingComponent />
        return (
            <Card>
                <TitlePageComponent title={`${selectedDevice && selectedDevice.name} Device`} description='Device details.' history={history} />
                {selectedDevice &&
                    <Row gutter={16}>
                        <Col span={24} xs={24} md={24}>
                            <Card className="detail-card"
                                // bodyStyle={{ minHeight: 135 }}
                                title={(
                                    <div>
                                        <Tooltip title={selectedDevice.is_enabled ? 'On' : 'Off'}>
                                            <Avatar style={{ backgroundColor: selectedDevice.is_enabled ? 'rgba(46, 184, 46,.7)' : 'rgba(255, 26, 26,.7)' }} />
                                        </Tooltip>
                                        <span style={{ marginLeft: '1em' }}>{selectedDevice.name}</span>
                                    </div>
                                )}
                            >
                                <div>
                                    <div><b>Address: </b>{selectedDevice.address} </div>
                                    <div><b>Nearest gateway: </b>{selectedDevice.nearest_gateway && selectedDevice.nearest_gateway.name}</div>
                                    <div><b>Last connection: </b>{selectedDevice.last_connection && moment().to(selectedDevice.last_connection)}</div>
                                    {selectedDevice.project && <div><b>Project: </b>{(selectedDevice.project as Project).name && (selectedDevice.project as Project).name}</div>}
                                </div>
                            </Card>
                        </Col>
                        <Col style={{ marginTop: '3em' }} span={24}>
                            <Last24HoursTransmissions deviceId={this.props.match.params.deviceId} />
                        </Col>
                        <Col style={{ marginTop: '3em' }} span={24}>
                            <div style={{ fontSize: '1.3em' }}>Last measures</div>
                            <Table rowKey={(row: Measure, index: number) => row._id || index.toString()}
                                columns={columns}
                                dataSource={measures.docs}
                                loading={this.props.MeasureStore.isLoading}
                                pagination={{
                                    hideOnSinglePage: true, size: 'small',
                                    pageSize: measures.limit,
                                    current: measures.page,
                                    total: measures.total
                                }}
                                onChange={this.tableOnChange} />
                        </Col>
                        <Col style={{ marginTop: '3em' }} span={24}>
                            <Button type='danger' onClick={this.removeFromProject}>Remove device from this project</Button>
                        </Col>
                    </Row>
                }
            </Card>
        )
    }
}