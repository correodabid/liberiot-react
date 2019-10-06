import React, { Component } from "react";
import { Button, Popover, Form as AntForm, Input } from 'antd'
import { inject, observer } from "mobx-react";
import { Formik, Form, Field, FormikActions } from "formik";

import Project from "../models/project.model";
import Profile from "../models/profile.model";

import { AuthStore, ProjectStore } from "../stores";

interface IProps {
    AuthStore?: AuthStore,
    ProjectStore?: ProjectStore
    onAddSuccess: Function
};

interface IState {
    visible: boolean,
}

@inject('AuthStore', 'ProjectStore')
@observer
export class AddNewButtonComponent extends Component<IProps, IState> {
    state = { visible: false }

    createNew = async (values: any, actions: FormikActions<any>) => {

        let profile: Profile = this.props.AuthStore!.selectedProfile
        let newProject: Project = {
            ...values,
            members: [profile._id],
            organization: profile.organization!._id
        };
        await this.props.ProjectStore!.addProject(newProject);
        await this.setState({ visible: false })
        actions.resetForm();
        this.props.onAddSuccess(true);
    }

    render() {
        return (
            <Popover
                placement="bottom"
                content={
                    <Formik enableReinitialize
                        initialValues={{}}
                        onSubmit={this.createNew}
                        render={({ resetForm }) => (
                            <Form>
                                <AntForm.Item >
                                    <Field name="name" render={({ field }: any) => (
                                        <Input {...field} placeholder="Name" type="text" />
                                    )} />
                                </AntForm.Item>
                                <AntForm.Item style={{ marginBottom: 0 }}>
                                    <Button style={{ margin: '.5em' }} htmlType="submit" className='save-button' shape="round">Save</Button>
                                    <Button style={{ margin: '.5em' }} shape="round" onClick={() => this.setState({ visible: false })}>Cancel</Button>
                                </AntForm.Item>
                            </Form>
                        )}
                    />
                }
                trigger="click"
                visible={this.state.visible}
                onVisibleChange={(visible) => this.setState({ visible })}
            >
                <Button shape="circle" icon='plus' style={{ color: "green" }} />
                {/* <Button shape="round" >
                    <Icon style={{ color: "green" }} type="plus-circle" />New
                </Button> */}
            </Popover>
        )
    }
}