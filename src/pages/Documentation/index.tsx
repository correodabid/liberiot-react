import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { inject, observer } from "mobx-react";
import { Card, Select } from "antd";

import DocumentationCollapse from './DocumentationCollapse';
import { TitlePageComponent, LiberiotBreadcrumbs } from "../../components";

import { DeviceStore, KeyStore } from "../../stores";

import Device from "../../models/device.model";
import Key from '../../models/key.model'

interface ILocationState {
    title: string;
}
interface IMatchParams {
    projectId: string;
    organizationId: string;
}

type IProps = RouteComponentProps<IMatchParams, any, ILocationState> & {
    DeviceStore: DeviceStore
    KeyStore: KeyStore
}

type IState = {
    project?: string
    device?: boolean
    key?: boolean
}

@inject('DeviceStore', 'KeyStore') @observer
export class DocumentationPage extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
        this.state = { project: props.match.params.projectId, device: false, key: false }
    }

    componentDidMount() {
        this.getDevices();
        this.props.KeyStore.getKeys()
    }

    getDevices = async () => {
        const { project } = this.state
        this.props.DeviceStore.getDevices({ project: project ? project : '' })
    }

    onSelectDevice = async (value: string) => {
        await this.setState({ device: true })
        this.props.DeviceStore.getDevice(value)
    }

    onSelectKey = async (value: string) => {
        await this.setState({ key: true })
        this.props.KeyStore.getKey(value)
    }

    render() {
        const { devices } = this.props.DeviceStore
        const { keys } = this.props.KeyStore
        // const { device, key } = this.state

        return (
            <div >
                <LiberiotBreadcrumbs {...this.props} />
                <Card >
                    <span className='hide-on-mobile'>
                        <TitlePageComponent title='Documentation' description='Api documentation' history={this.props.history} />
                    </span>
                    <span className='hide-on-desktop'>
                        <TitlePageComponent title='Documentation' description='Api documentation' />
                    </span>
                    <div style={{ margin: '1em' }}>
                        <Select placeholder="Select a device" className="responsive-select" onChange={this.onSelectDevice}>
                            {devices && devices.docs.length > 0 &&
                                devices.docs.map((device: Device) => <Select.Option key={device._id}>{device.name}</Select.Option>)
                            }
                        </Select>
                    </div>
                    <div style={{ margin: '1em' }}>
                        <Select placeholder="Select the api key" className="responsive-select" onChange={this.onSelectKey}>
                            {keys && keys.docs.length > 0 &&
                                keys.docs.map((key: Key) => <Select.Option key={key._id}>{key.name}</Select.Option>)
                            }
                        </Select>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <DocumentationCollapse />
                    </div>
                </Card >
            </div>
        )
    }
}