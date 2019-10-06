import React, { Component } from "react";
import './styles.scss'
import { RouteComponentProps } from "react-router";
import { DetailCards, DetailInfoComponent } from "../../components";
import { Card, Button, Icon, Col, Row, Dropdown, Menu } from "antd";
import { GoBackComponent } from "../../components/GoBackComponent";
import { Link } from "react-router-dom";
import { goToException } from "../../utils/util";
import { inject, observer } from "mobx-react";
import { AuthStore, OrganizationStore, ProjectStore, ProfileStore } from "../../stores";


interface IProps extends RouteComponentProps<{ id: string }> {
    AuthStore: AuthStore;
    OrganizationStore: OrganizationStore;
    ProjectStore: ProjectStore
    ProfileStore: ProfileStore
};

interface IState {
    id: string,
    path: string,
    isOrganization: boolean
}
@inject('AuthStore', 'OrganizationStore', 'ProjectStore', 'ProfileStore')
@observer
export default class OrganizationDetailPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            path: this.props.match.path.split('/')[1],
            id: this.props.match.params.id,
            isOrganization: this.props.match.path.split('/')[1] === 'organization'
        };
    }

    componentDidMount() {
        this.getData()
    }

    getData = async () => {
        if (this.state.isOrganization)
            await this.getOrganization();
        else
            await this.getProject();
    }

    getProject = async () => {
        try {
            await this.props.ProjectStore.getProject(this.state.id)
            await this.props.ProjectStore.getMembers(this.props.ProjectStore.selectedProject!._id)
        } catch (err) {
            goToException(this.props)
        }
    }

    getOrganization = async () => {
        this.props.OrganizationStore.getOrganization(this.state.id)
        this.props.ProfileStore.getUsers();
    }

    render() {
        const { isOrganization } = this.state;
        const { match } = this.props;
        const organizationMembers = this.props.ProfileStore.users;
        const { selectedOrganization } = this.props.OrganizationStore
        const { selectedProfile } = this.props.AuthStore;
        const { projectMembers, selectedProject } = this.props.ProjectStore;

        let detailIsLoading: boolean = false,
            total: number = 0,
            members: Array<any> = [],
            object: any = {};

        if (isOrganization) {
            detailIsLoading = this.props.OrganizationStore.isLoading;
            object = selectedOrganization;
            members = organizationMembers.docs;
            total = organizationMembers.total;
        } else {
            detailIsLoading = this.props.ProjectStore.isLoading;
            object = selectedProject;
            members = projectMembers ? projectMembers.docs : [];
            total = projectMembers ? projectMembers.total : 0;
        }

        return (
            <Card className='details-organization-page'>
                {object &&
                    <div>
                        <Row>
                            <Col span={12}>
                                <GoBackComponent history={this.props.history} />
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                {selectedProfile.is_admin && <Dropdown placement="bottomRight"
                                    overlay={
                                        <Menu>
                                            <Menu.Item key="edit">
                                                <Link to={{ pathname: `${match.url}/edit`, state: { title: object.name } }} style={{ textDecoration: 'none' }}>
                                                    <Icon style={{ marginRight: '.5em' }} type="edit" /> Edit
                                                </Link>
                                            </Menu.Item>
                                        </Menu>
                                    } trigger={['click']}>
                                    <Button shape="circle"><Icon type="ellipsis" /></Button>
                                </Dropdown>}
                            </Col>
                        </Row>
                        <span>
                            <DetailInfoComponent object={object}
                                total={total}
                                users={members}
                                refresh={this.getData} isOrganization={isOrganization}
                                isLoading={detailIsLoading} />
                            <br />
                            <DetailCards {...this.props} title={object.name} />
                        </span>
                    </div>
                }
            </Card>
        )
    }
}