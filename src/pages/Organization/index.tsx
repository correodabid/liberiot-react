import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Card, message } from "antd";
import { CardComponent } from '../../components/DashboardCard/CardComponent'
import { DividerComponent, OrganizationLogo, ListComponent, LoadingComponent } from "../../components";
import './styles.scss'
import logo from '../../assets/positivo.png'

import { AuthStore, OrganizationStore, ProjectStore } from "../../stores";

interface IProps {
    AuthStore: AuthStore;
    OrganizationStore: OrganizationStore
    ProjectStore: ProjectStore
};

interface IState {
    cards: boolean
}

@inject('AuthStore', 'OrganizationStore', 'ProjectStore')
@observer
export default class OrganizationPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = { cards: true };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        const { organization } = this.props.AuthStore.selectedProfile;
        const organizationId = typeof organization === 'string' ? organization : organization!._id;
        organizationId && this.props.OrganizationStore.getOrganization(organizationId)
    }

    onDelete = async () => {
        this.fetchData();
        await this.setState({ cards: true })
        message.success('Projects sent to the trash');
    }

    render() {
        const { selectedProfile } = this.props.AuthStore;
        const { isLoading } = this.props.OrganizationStore

        if (isLoading) return <LoadingComponent />
        return (
            <Card style={{ padding: '1em' }}>
                <OrganizationLogo logo={logo} />
                <DividerComponent title="Organization" />
                <CardComponent type="organization" />
                <DividerComponent
                    onAddSuccess={this.fetchData} title="Projects" buttons={selectedProfile.is_admin ? true : false}
                    onClickSetting={(key: any) => this.setState({ cards: !this.state.cards })} />
                <span>
                    {this.state.cards ?
                        <CardComponent type="project" />
                        :
                        <ListComponent onDelete={() => this.onDelete()} />
                    }
                </span>
            </Card>
        )
    }
}