import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { Card, Table, Icon, Divider, Modal, message } from "antd";
import { ColumnProps } from "antd/lib/table";

import { LiberiotBreadcrumbs, TitlePageComponent } from "../../components";

import Profile from "../../models/profile.model";

import { ProfileStore, AuthStore, ProjectStore } from "../../stores";
import { IPaginationProps } from "../../models/interfaces";
import { UserProject } from "../../models/userProject.model";

interface ILocationState {
    title: string;
}
interface IMatchParams {
    projectId: string;
    organizationId: string;
}

interface IProps extends RouteComponentProps<IMatchParams, any, ILocationState> {
    ProfileStore: ProfileStore;
    AuthStore: AuthStore;
    ProjectStore: ProjectStore;
}

interface IState {
    isOrganization: boolean;
    options: {
        page?: number;
        limit?: number;
        search?: string;
    }
}

@inject('ProfileStore', 'AuthStore', 'ProjectStore')
@observer
export class UsersPage extends Component<IProps, IState> {
    columns: Array<ColumnProps<Profile>> = [];

    constructor(props: IProps) {
        super(props);
        const { selectedProfile } = this.props.AuthStore;

        this.state = {
            isOrganization: this.props.match.path.includes('/organization/'),
            options: {}
        }

        this.columns = [
            {
                title: 'Name', dataIndex: 'name', key: 'name',
                render: (text: any, record: Profile) => `${record.first_name} ${record.last_name}`
            },
            { title: 'Email', dataIndex: 'email', key: 'email' },
            { title: 'Admin', dataIndex: 'is_admin', key: 'is_admin', render: (text: boolean) => `${text ? 'Yes' : 'No'}` },
            {
                title: 'Actions', dataIndex: 'actions', key: 'actions', className: `${selectedProfile.is_admin ? null : 'hide'}`,
                render: (text: any, record: Profile) => (
                    <span>
                        <NavLink to={`/users/${record._id}/edit`}><Icon type="edit" /></NavLink>
                        <Divider type='vertical' />
                        <button disabled={selectedProfile._id === record._id}
                            className='link' onClick={() => this.handleDelete(record)}><Icon type="delete" /></button>
                    </span>
                )
            }
        ]
    }

    componentDidMount() {
        this.state.isOrganization ? this.getOrganizationProfiles() : this.getProjectProfiles();
    }

    getOrganizationProfiles = async () => {
        await this.props.ProfileStore.getUsers(this.state.options);
    }

    getProjectProfiles = async () => {
        const { projectId } = this.props.match.params;

        await this.props.ProjectStore.getMembers(projectId, this.state.options)
    }

    handleDelete = (record: Profile) => {
        Modal.confirm({
            title: 'Delete profile',
            content: `Are you sure you want to delete ${record.first_name} ${record.last_name}?`,
            okType: 'danger',
            okText: 'Yes, delete',
            cancelText: 'Cancel',
            maskClosable: true,
            onOk: async () => {
                try {
                    if (this.state.isOrganization) {
                        await this.props.ProfileStore.deleteProfile(record._id!)
                        await this.getOrganizationProfiles();
                    } else {
                        await this.props.ProjectStore.deleteMember(this.props.match.params.projectId, record.UserProjectId)
                        await this.getProjectProfiles();
                    }

                    message.success('Profile deleted')
                } catch (error) {
                    message.error('Error deleting profile')
                }
            }
        });
    }

    onPageChange = async (page: number) => {
        await this.setState({ options: { ...this.state.options, page } });
        this.state.isOrganization ? this.getOrganizationProfiles() : this.getProjectProfiles();
    }

    mapProjectMembers = (): IPaginationProps<Profile> => {
        const { projectMembers } = this.props.ProjectStore;

        if (projectMembers)
            return {
                ...projectMembers,
                docs: projectMembers.docs
                    .map((userProject: UserProject) => ({
                        ...userProject.profile,
                        UserProjectId: userProject._id
                    }))
                    .filter((profile: Profile) => profile._id && profile)
            }
        else {
            return { docs: [], page: 0, total: 0, limit: 0, pages: 0 }
        }
    }

    render() {
        const { location } = this.props;
        const { isOrganization } = this.state;
        const { ProfileStore } = this.props;

        const members: IPaginationProps<Profile> = isOrganization ? ProfileStore.users : this.mapProjectMembers();
        const { isLoading } = this.props[isOrganization ? 'ProfileStore' : 'ProjectStore']

        return (
            <div id="users">
                <LiberiotBreadcrumbs {...this.props} />
                <Card>
                    <TitlePageComponent title='Users' description={`List of your users in ${location.state && location.state.title}.`} />
                    <Table rowKey={(row: Profile, index: number) => row._id || index.toString()}
                        columns={this.columns}
                        dataSource={members.docs}
                        loading={isLoading}
                        pagination={{
                            hideOnSinglePage: true, size: 'small',
                            current: members.page, total: members.total, pageSize: members.limit,
                            onChange: this.onPageChange
                        }} />
                </Card>
            </div>
        )
    }
}