import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { inject, observer } from "mobx-react";
import { Card } from "antd";

import { DevicesTable, TitlePageComponent } from "../../components";

import { GatewayStore } from "../../stores";
import { LoadingComponent } from "../../components/LoadingComponent";
import { LastWeekHeartbeats } from "./HeatMap";

interface IProps extends RouteComponentProps<{ gatewayId: string }> {
    GatewayStore: GatewayStore
}
interface IState {
    isLoading: boolean;
}


@inject('GatewayStore') @observer
export class GatewayDetailPage extends Component<IProps, IState> {
    state: IState = {
        isLoading: false
    }

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        await this.setState({ isLoading: true })
        const { gatewayId } = this.props.match.params;

        try {
            await this.props.GatewayStore.getGateway(gatewayId);
            await this.props.GatewayStore.getDevicesAssociated(gatewayId);
        } catch (error) {
            console.log(error)
        }
        await this.setState({ isLoading: false })
    }

    render() {
        const { devices, selectedGateway } = this.props.GatewayStore;
        const { history } = this.props;
        const { isLoading } = this.state;

        if (isLoading) return <LoadingComponent />

        return (
            <Card >
                <span className='hide-on-mobile'>
                    <TitlePageComponent title={`${selectedGateway && selectedGateway.name} Gateway`} description='Gateway details.' history={history} />
                </span>
                <span className='hide-on-desktop'>
                    <TitlePageComponent title={`${selectedGateway && selectedGateway.name} Gateway`} description='Gateway details.' />
                </span>
                <Card title="Associated devices">
                    <DevicesTable devices={devices} />
                </Card>
                <Card style={{ marginTop: '3em' }} >
                    <LastWeekHeartbeats />
                </Card>
            </Card>
        )
    }
}

