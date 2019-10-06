import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Formik, Field, Form } from "formik";
import { Form as aform, Row, Col, Input, Button, Card, Select, Radio } from "antd";

import { TitlePageComponent, LoadingComponent } from "../../components";

import Gateway from "../../models/gateway.model";
import Project from "../../models/project.model";

import { GatewayStore, ProjectStore } from "../../stores";

interface IProps extends RouteComponentProps<{ gatewayId: string }> {
    GatewayStore: GatewayStore
    ProjectStore: ProjectStore
}

@inject('GatewayStore', 'ProjectStore') @observer
export default class EditGatewayPage extends Component<IProps> {

    componentDidMount() {
        this.fetchGateway();
    }

    fetchGateway = async () => {
        this.props.GatewayStore.getGateway(this.props.match.params.gatewayId)
        await this.props.ProjectStore.getProjects({ active: true });
    }

    editGateway = async (gateway: Gateway) => {
        await this.props.GatewayStore.editGateway(gateway)
        await this.props.history.goBack()
    }

    render() {
        const { projects } = this.props.ProjectStore;
        const { selectedGateway, isLoading } = this.props.GatewayStore

        if (isLoading) return <LoadingComponent />
        return (
            <Card >
                <span className='hide-on-mobile'>
                    <TitlePageComponent title='Edit Gateway' description='Edit your gateway.' history={this.props.history} />
                </span>
                <span className='hide-on-desktop'>
                    <TitlePageComponent title='Edit Gateway' description='Edit your gateway.' />
                </span>
                <Formik
                    initialValues={selectedGateway!}
                    onSubmit={this.editGateway}
                    render={({ values, errors, handleChange, setFieldValue, resetForm }) =>
                        <Form className="edit-responsive" style={{ margin: '0 auto' }}>
                            <aform.Item label="Name">
                                <Field name="name" render={({ field }: any) => (<Input {...field}
                                    value={values.name} placeholder="Name" type="text" />)} />
                            </aform.Item>
                            <aform.Item label="Address">
                                <Field name="address" render={({ field }: any) => (<Input {...field}
                                    value={values.address} placeholder="Address" type="text" />)} />
                            </aform.Item>
                            <aform.Item label="Project">
                                <Field name="project" component={Select} placeholder="Select a project" allowClear
                                    value={values.project}
                                    onChange={(value: any) => setFieldValue('project', value)}>
                                    {
                                        projects.map((project: Project) => <Select.Option key={project._id}>{project.name}</Select.Option>)
                                    }
                                </Field>
                            </aform.Item>
                            <aform.Item label="Gateway mode" style={{ textAlign: 'left' }}>
                                <Field name="is_production" component={Radio.Group} value={values.is_production}
                                    onChange={(e: any) => setFieldValue('is_production', e.target.value)} >
                                    <Radio value={true}>Production</Radio>
                                    <Radio value={false}>Development</Radio>
                                </Field>
                            </aform.Item>
                            <Row>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    <Button disabled={!values.name} type="primary" className='save-button' shape='round' htmlType="submit">Save</Button>
                                    <Button onClick={() => this.props.history.goBack()} style={{ marginLeft: 8 }} shape='round' > Cancel</Button>
                                </Col>
                            </Row>
                        </Form>
                    }
                ></Formik>
            </Card>
        )
    }
}