import React, { Component } from "react";
import Organization from "../../models/organization.model";
import Project from "../../models/project.model";
import { DetailUsersComponent } from "./DetailUsersComponent";
import { Modal, Spin } from "antd";
import { OrganizationModal } from "./OrganizationModal";
import { ProjectModal } from "./ProjectModal";
import Profile from "../../models/profile.model";


interface IProps {
    object: Organization | Project;
    users: Array<any>;
    total: number;
    refresh(): Promise<void>;
    isOrganization: boolean;
    isLoading: boolean
}

interface IState {
    modal: boolean
}

export class DetailInfoComponent extends Component<IProps, IState>{
    state: IState = {
        modal: false
    };

    onCancel = async () => {
        await this.setState({ modal: false });
        await this.props.refresh();
    }

    render() {
        const { object, users, total, isOrganization, isLoading } = this.props;
        const { modal } = this.state;

        let usersAvatar: Array<Profile> = users;
        if (!isOrganization) {
            usersAvatar = users.map((user) => user.profile)
        }
        return (
            <Spin spinning={isLoading}>
                <p>
                    <span style={{ fontSize: '2.5em' }}> {object.name}</span>
                </p>
                <DetailUsersComponent onClick={() => this.setState({ modal: true })} data={usersAvatar} total={total} />
                <Modal
                    // style={{ top: 200 }}
                    title={`People on ${object.name}`}
                    visible={modal}
                    footer={null}
                    onCancel={this.onCancel}
                    destroyOnClose
                >
                    {
                        isOrganization ?
                            <OrganizationModal users={users} total={total} onClose={() => this.props.refresh()} />
                            : <ProjectModal users={users} total={total} onClose={() => this.props.refresh()} />
                    }
                </Modal>
            </Spin>
        )
    }
}