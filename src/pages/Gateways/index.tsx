import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { Icon, Modal, Card, Col, Pagination, Avatar, Empty, Spin } from "antd";
import { ColumnProps } from "antd/lib/table";
import moment from 'moment';
import { capitalize } from "lodash";

import { TitlePageComponent, LiberiotBreadcrumbs } from "../../components";

import Gateway from "../../models/gateway.model";

import { AuthStore, GatewayStore } from "../../stores";

const { Meta } = Card;

interface IProps extends RouteComponentProps<{ projectId: string }> {
    AuthStore: AuthStore
    GatewayStore: GatewayStore
}

interface IState {
    projectId: string,
    activeKey: string;
}
@inject('AuthStore', 'GatewayStore')
@observer
export default class GatewaysPage extends Component<IProps, IState> {
    columns: Array<ColumnProps<Gateway>> = [];

    constructor(props: IProps) {
        super(props);
        this.state = {
            projectId: props.match.params.projectId,
            activeKey: 'dev'
        }
    }

    componentDidMount() {
        this.getGateways();
    }

    deleteGateway(gateway: Gateway) {
        Modal.confirm({
            title: `¿Delete ${gateway.name}?`,
            content: 'You cannot undo this action',
            okType: 'danger',
            okText: 'Delete',
            cancelText: 'Cancel',
            maskClosable: true,
            onOk: async () => {
                if (gateway._id) {
                    await this.props.GatewayStore.deleteGateway(gateway._id)
                    await this.getGateways()
                }
            }
        });
    }

    getGateways = async () => {
        await this.props.GatewayStore.getGateways({
            project: this.props.match.params.projectId,
            populate: 'project',
            is_production: this.state.activeKey === 'prod'
        });
    }

    removeFromProject = async (gateway: Gateway) => {
        const { selectedGateway, editGateway } = this.props.GatewayStore

        Modal.confirm({
            title: `Are you sure you want to remove ${gateway.name} from this project?`,
            okText: 'Remove',
            cancelText: 'Cancel',
            maskClosable: true,
            onOk: async () => {
                await editGateway({ ...selectedGateway, project: undefined })
                await this.getGateways()
            }
        });
    }

    changeState = async (gateway: Gateway) => {
        const { selectedGateway, editGateway } = this.props.GatewayStore
        let state = gateway.is_enabled ? 'disable' : 'enable'
        Modal.confirm({
            title: `Are you sure you want to ${state} ${gateway.name}?`,
            okText: `${capitalize(state)}`,
            cancelText: 'Cancel',
            maskClosable: true,
            onOk: async () => {
                await editGateway({ ...selectedGateway, is_enabled: !gateway.is_enabled });
                await this.getGateways();
            }
        });
    }

    onPageChange = async () => {
        console.log('on page change')
    }

    handleTabChange = async (activeKey: string) => {
        await this.setState({ activeKey });
        await this.getGateways();
    }


    getColorStatus = (gateway: Gateway): string => {
        if (moment().diff(gateway.last_connection, 'minute') >= 5)
            return 'rgba(255, 165, 0,.7)';
        else
            return 'rgba(46, 184, 46,.7)';
    }

    render() {
        const { projectId, activeKey } = this.state;
        const { selectedProfile } = this.props.AuthStore
        const { isLoading, gateways } = this.props.GatewayStore

        return (
            <Spin spinning={isLoading}>
                <LiberiotBreadcrumbs {...this.props} />
                <Card
                    tabList={[{ key: 'dev', tab: 'Development' }, { key: 'prod', tab: 'Production' }]}
                    onTabChange={this.handleTabChange}
                    activeTabKey={activeKey}>
                    <TitlePageComponent title='Gateways' description='See your gateways.' />
                    {gateways && gateways.total > 0 ?
                        gateways.docs.map((gateway: Gateway, index: number) =>
                            <Col key={index} xs={24} sm={24} md={12} lg={8} xl={8}>
                                <Card className="gateways-responsive"
                                    style={{ margin: '1vh', backgroundColor: gateway.is_enabled ? '' : 'rgba(140,140,140,.2)' }}
                                    actions={selectedProfile.is_admin ?
                                        [
                                            <Link to={`/gateways/${gateway._id}`}><Icon type="eye" /></Link>,
                                            <Link to={`/gateways/${gateway._id}/edit`}><Icon type="edit" /></Link>,
                                            <span onClick={() => this.deleteGateway(gateway)}><Icon type="delete" /></span>,
                                            <span onClick={() => this.changeState(gateway)}>{gateway.is_enabled ? 'Disable' : 'Enable'}</span>
                                        ] :
                                        []
                                    }
                                >
                                    <Meta
                                        avatar={<Avatar style={{ backgroundColor: this.getColorStatus(gateway) }} />}
                                        title={gateway.name}
                                        description={
                                            <span>
                                                <p><b>MAC</b> <small>{gateway.mac}</small></p>
                                                <p><b>Last connection</b>
                                                    <small> {gateway.last_connection && moment().to(gateway.last_connection)}</small>
                                                </p>
                                                <p><b>Project </b>
                                                    <small> {gateway.project && gateway.project.name}</small>
                                                    <br />{
                                                        projectId &&
                                                        <button className='link' onClick={() => this.removeFromProject(gateway)} style={{ fontSize: '.8em' }}> Remove from project</button>
                                                    }
                                                </p>
                                            </span>
                                        }
                                    />
                                </Card>
                            </Col>
                        )
                        : <Empty />
                    }
                    {gateways.total > 9 &&
                        <Pagination style={{ textAlign: 'right' }} size="small" onChange={this.onPageChange} total={gateways.total} />
                    }
                </Card>
            </Spin>
        )
    }
}

export * from './detail';