import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Button, Icon, Input, Row, Col, Pagination, Modal, message } from "antd";

import UserAvatar from "../UserAvatar";

import Profile from "../../models/profile.model";

import { ProfileStore, CredentialStore } from "../../stores";
import { AddForm } from "./AddForm";
import { FormikActions } from "formik";

interface IProps {
    users: Array<any>;
    total: number;
    ProfileStore?: ProfileStore;
    CredentialStore?: CredentialStore;
    onClose(): void
}

interface IState {
    queryOptions: {
        page?: number,
        search?: string,
        limit?: string,
        email?: string
    };
    add: boolean
}

@inject('ProfileStore', 'CredentialStore')
@observer
export class OrganizationModal extends Component<IProps, IState> {
    state = {
        queryOptions: { page: 1 },
        add: false
    }

    onPageChange = async (page: number) => {
        await this.setState({ queryOptions: { ...this.state.queryOptions, page } });
        await this.props.ProfileStore!.getUsers(this.state.queryOptions)
    }

    searchUsers = async (search: string) => {
        await this.setState({ queryOptions: { ...this.state.queryOptions, search } });
        await this.props.ProfileStore!.getUsers(this.state.queryOptions)
    }

    removeFrom = (user: Profile) => {
        Modal.confirm({
            title: 'Remove ' + user.first_name + ' ' + user.last_name,
            content: 'Are you sure of removing this user?',
            okType: 'danger',
            okText: 'Delete',
            cancelText: 'Cancel',
            maskClosable: true,
            onOk: async () => {
                await this.props.ProfileStore!.deleteProfile(user._id!)
                await this.props.ProfileStore!.getUsers();
            }
        });
    }

    handleSubmit = async (values: Profile, actions: FormikActions<Profile>) => {
        try {
            actions.setSubmitting(true)
            await this.props.CredentialStore!.inviteToOrganization(values);
            actions.setSubmitting(false)
            await this.setState({ add: false })
            this.props.onClose();
        } catch (error) {
            message.error('Error adding user');
            actions.setSubmitting(false)
        }
    }

    render() {
        const { users, total } = this.props;
        const { add } = this.state;

        if (add)
            return (
                <AddForm onCancel={() => this.setState({ add: false })} onSumbit={this.handleSubmit} />
            )
        else
            return (
                <div>
                    <div style={{ textAlign: 'center', marginBottom: '2em' }}>
                        <Button shape="round" style={{ backgroundColor: '#2da562', color: 'white' }}
                            onClick={() => this.setState({ add: true })}>
                            <Icon type="plus" />Add People
                        </Button>
                        <Input.Search style={{ width: '75%', marginTop: '.5em' }}
                            placeholder="Search organization's members"
                            onSearch={(search: string) => this.searchUsers(search)}
                            onChange={(event) => this.searchUsers(event.target.value)} />
                    </div>
                    <Row>
                        {users.map((user: Profile, index: number) =>
                            <Col span={12} key={index} style={{ padding: '.3em' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <UserAvatar user={user} fontSize={"1em"} size={28} />
                                    <div>
                                        {user.first_name} {user.last_name}
                                        <i><b>  {user.is_admin ? 'Admin' : 'Dev'}</b></i><br />
                                        <button className='link' onClick={() => this.removeFrom(user)}>Remove</button>
                                    </div>
                                </div>
                            </Col>
                        )}
                        {users.length === 0 && <h4 style={{ textAlign: 'center' }}>There are no users</h4>}
                    </Row>
                    <Row type='flex' justify='end' className='mt10 mb10'>
                        <Pagination defaultCurrent={1} onChange={this.onPageChange} total={total}
                            size="small" />
                    </Row>
                </div>
            )
    }
}