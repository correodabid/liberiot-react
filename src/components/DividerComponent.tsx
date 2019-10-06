import React, { Component } from "react";
import { Divider, Col, Row, Tooltip } from 'antd'
import { AddNewButtonComponent, SettingsButtonComponent } from "./";
import { Link } from "react-router-dom";
import { OrganizationStore } from "../stores";
import { inject, observer } from "mobx-react";


interface IProps {
    title: string,
    buttons?: boolean,
    onAddSuccess?: Function,
    onClickSetting?: Function
    OrganizationStore?: OrganizationStore
};

interface IState {
    visible: boolean,
    settings: boolean
}
@inject('OrganizationStore') @observer
export class DividerComponent extends Component<IProps, IState> {
    state = { visible: false, settings: false }

    onSuccess = async () => {
        if (this.props.onAddSuccess)
            this.props.onAddSuccess(true)
    }

    onClickSetting = async (key: any) => {
        if (this.props.onClickSetting)
            this.props.onClickSetting(key)
    }

    render() {
        const { buttons, title } = this.props
        const { selectedOrganization } = this.props.OrganizationStore!

        return (
            <Row type='flex' justify="space-between" align='middle'>
                <Col>
                    {buttons &&
                        <AddNewButtonComponent onAddSuccess={this.onSuccess} />
                    }
                </Col>
                <Col span={16} xs={buttons ? 16 : 24} md={16}>
                    <Divider type="horizontal" > {title} </Divider>
                </Col>
                <Col>
                    {buttons &&
                        <span>
                            <SettingsButtonComponent onClickSetting={(key: any) => this.onClickSetting(key)}
                                organizationId={selectedOrganization!._id} />
                            <span className='hide-on-mobile'>
                                <Tooltip title="Recycle bin">
                                    <Link to={`/organization/${selectedOrganization!._id}/trash`} >
                                        <span style={{ marginLeft: '.5em' }}>Recycle bin</span>

                                        {/* <Icon style={{ marginLeft: '.5em', color: 'black', fontSize: '1.5em' }} type="delete" /> */}
                                    </Link>
                                </Tooltip>
                            </span>
                        </span>
                    }
                </Col>
            </Row >
        )
    }
}