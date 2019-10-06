import React, { Component } from "react";
import { Button, Icon, Input, Row, Col, Pagination, Modal, message } from "antd";
import { inject, observer } from "mobx-react";
import { FormikActions } from "formik";

import UserAvatar from "../UserAvatar";
import { AddForm } from "./AddForm";

import Profile from "../../models/profile.model";

import { ProjectStore } from "../../stores";

interface IProps {
    users: Array<any>;
    total: number;
    ProjectStore?: ProjectStore;
    onClose(): void
}

interface IState {
    queryOptions: {
        page?: number,
        search?: string
    };
    add: boolean
}

@inject('ProjectStore') @observer
export class ProjectModal extends Component<IProps, IState> {
    state = {
        queryOptions: { page: 1 },
        add: false
    }

    onPageChange = async (page: number) => {
        const { selectedProject } = this.props.ProjectStore!;
        await this.setState({ queryOptions: { ...this.state.queryOptions, page } });
        await this.props.ProjectStore!.getMembers(selectedProject!._id, this.state.queryOptions)
    }

    searchUsers = async (search: string) => {
        const { selectedProject } = this.props.ProjectStore!;
        await this.setState({ queryOptions: { ...this.state.queryOptions, search } });
        await this.props.ProjectStore!.getMembers(selectedProject!._id, this.state.queryOptions)
    }

    removeFrom = (user: any) => {
        const { selectedProject } = this.props.ProjectStore!;

        Modal.confirm({
            title: 'Remove ' + user.profile.first_name + ' ' + user.profile.last_name,
            content: 'Are you sure of removing this user?',
            okType: 'danger',
            okText: 'Delete',
            cancelText: 'Cancel',
            maskClosable: true,
            onOk: async () => {
                await this.props.ProjectStore!.deleteMember(selectedProject!._id, user._id);
                await this.props.ProjectStore!.getMembers(selectedProject!._id, this.state.queryOptions)
            }
        });
    }

    handleSubmit = async (values: Profile, actions: FormikActions<Profile>) => {
        const { selectedProject } = this.props.ProjectStore!;
        try {
            actions.setSubmitting(true)
            await this.props.ProjectStore!.addMember(values, selectedProject!._id);
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
                            placeholder="Search project's members"
                            onSearch={(search: string) => this.searchUsers(search)}
                            onChange={(event) => this.searchUsers(event.target.value)} />
                    </div>
                    <Row>
                        {users.map((user: any, index: number) => {
                            return (
                                user.profile && <Col span={12} key={index}>
                                    <Col span={4}>
                                        <UserAvatar user={user.profile} fontSize={"1em"} size={28} />
                                    </Col>
                                    <Col span={20}>
                                        {user.profile.first_name} {user.profile.last_name}
                                        <i><b>  {user.profile.is_admin ? 'Admin' : 'Dev'}</b></i><br />
                                        <button className='link' onClick={() => this.removeFrom(user)}>Remove</button>
                                    </Col>
                                </Col>
                            )
                        })}
                        {users.length === 0 && <h4 style={{ textAlign: 'center' }}>There are no users</h4>}
                    </Row>
                    <Row type='flex' justify='end' className='mt10 mb10'>
                        <Pagination defaultCurrent={1} onChange={this.onPageChange} total={total} pageSize={2}
                            size="small" />
                    </Row>
                </div>
            )
    }
}