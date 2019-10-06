import React, { Component } from "react";
import './styles.scss'
import { RouteComponentProps } from "react-router";
import { inject, observer } from "mobx-react";
import { Card, Form as aform, Row, Col, Input, Button } from "antd";
import { Formik, Field, Form } from "formik";

import { LiberiotBreadcrumbs, LoadingComponent } from "../../components";
import { OrganizationStore, ProjectStore } from "../../stores";

interface IProps extends RouteComponentProps<{ projectId: string, id: string }> {
    OrganizationStore: OrganizationStore
    ProjectStore: ProjectStore;
};

interface IState {
    type: string
}

@inject('OrganizationStore', 'ProjectStore') @observer
export default class EditPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = { type: this.props.match.path.split('/')[1] };
    }

    componentDidMount() {
        this.fetch();
    }

    fetch = async () => {
        if (this.state.type === 'project') {
            await this.props.ProjectStore.getProject(this.props.match.params.projectId);
        }
    }

    edit = async (values: any) => {
        if (this.state.type === 'project') {
            await this.props.ProjectStore.editProject(values);
        } else {
            await this.props.OrganizationStore.editOrganization(values)
        }
        this.props.history.goBack();
    }


    render() {
        const { type } = this.state;
        const { isLoading, selectedOrganization } = this.props.OrganizationStore;
        const { selectedProject } = this.props.ProjectStore;
        const initialValues = type === 'project' ? selectedProject : selectedOrganization;
        if (isLoading) return <LoadingComponent />
        return (
            <div>
                <LiberiotBreadcrumbs {...this.props} />
                <Card>
                    <h1 style={{ fontSize: '2em' }}>Edit details</h1>
                    <hr />
                    <Formik
                        initialValues={initialValues}
                        onSubmit={this.edit}
                        render={({ values }) =>
                            <Form style={{ margin: '2em' }}>
                                <Row gutter={24}>
                                    <Col sm={{ span: 24 }} lg={{ span: 24 }} >
                                        <aform.Item label="Name">
                                            <Field name="name" render={({ field }: any) => (<Input {...field}
                                                value={values!.name} placeholder="Name" type="text" />)} />
                                        </aform.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{ textAlign: 'center' }}>
                                        {values!.name && <Button shape="round" className='save-button' htmlType="submit">Save</Button>}
                                        <Button shape="round" onClick={() => this.props.history.goBack()} style={{ marginLeft: 8 }} > Cancel</Button>
                                    </Col>
                                </Row>
                            </Form>
                        }
                    ></Formik>
                </Card>
            </div>
        )
    }
}