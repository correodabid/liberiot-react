import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { inject, observer } from "mobx-react";

import { Form as AntForm, Input, Button, message, Card, Select, Radio } from "antd";
import { Formik, Form, Field, FormikProps, FieldProps, FormikActions } from "formik";
import { string, object } from "yup";

import { TitlePageComponent, InputError } from "../../components";

import Device from "../../models/device.model";
import Project from "../../models/project.model";

import { DeviceStore, ProjectStore } from "../../stores";

interface IMatchParams {
    deviceId: string;
    organizationId: string;
}

interface IProps extends RouteComponentProps<IMatchParams> {
    DeviceStore: DeviceStore,
    ProjectStore: ProjectStore
}

@inject('DeviceStore', 'ProjectStore')
@observer
export class EditDevicePage extends Component<IProps> {

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.props.DeviceStore.getDevice(this.props.match.params.deviceId)
        this.props.ProjectStore.getProjects({ active: true });
    }

    handleSubmit = async (values: Device, actions: FormikActions<Device>) => {
        const { editDevice } = this.props.DeviceStore
        actions.setSubmitting(true);

        try {
            await editDevice(values)
            message.success('The device is updated.')
            this.props.history.goBack();
        } catch (error) {
            message.error('Error. The device could not be updated.')
        }
        actions.setSubmitting(false);
    }

    render() {
        const { history } = this.props;
        const { isLoading, selectedDevice } = this.props.DeviceStore
        const { projects } = this.props.ProjectStore;

        return (
            <Card loading={isLoading}>
                <TitlePageComponent title={`${selectedDevice && selectedDevice.name} Device`} description='Edit your device.' history={history} />
                <Formik initialValues={selectedDevice} enableReinitialize
                    validationSchema={object<Device>().shape({ name: string().required('The name is required') })}
                    onSubmit={this.handleSubmit}
                    render={({ values, isSubmitting, setFieldValue }: FormikProps<Device>) =>
                        <Form className='small-form'>
                            <AntForm.Item label="Name" style={{ textAlign: 'left' }}>
                                <Field name="name" render={({ field }: FieldProps) => (
                                    <Input {...field} value={values.name} placeholder="Name" />
                                )} />
                                <InputError title='name' />
                            </AntForm.Item>
                            <AntForm.Item label="Project" style={{ textAlign: 'left' }}>
                                <Field name="project" render={({ field }: FieldProps) => (
                                    <Select {...field} value={values.project} placeholder="Select a project" allowClear
                                        onChange={(value: any) => setFieldValue('project', value)}>
                                        {
                                            projects.map((project: Project) => <Select.Option key={project._id}>{project.name}</Select.Option>)
                                        }
                                    </Select>
                                )} />
                            </AntForm.Item>
                            <AntForm.Item label="Device mode" style={{ textAlign: 'left' }}>
                                <Field name="is_production" component={Radio.Group} placeholder="Select a mode" allowClear
                                    value={values.is_production}
                                    onChange={(e: any) => setFieldValue('is_production', e.target.value)} >
                                    <Radio value={true}>Production</Radio>
                                    <Radio value={false}>Development</Radio>
                                </Field>
                            </AntForm.Item>
                            <AntForm.Item style={{ textAlign: 'center' }}>
                                <Button disabled={isSubmitting} className='save-button' shape='round' loading={isSubmitting} htmlType="submit">Save</Button>
                                <Button onClick={() => history.goBack()} style={{ marginLeft: 8 }} shape='round' > Cancel</Button>
                            </AntForm.Item>
                        </Form>
                    }
                />
            </Card>
        )
    }
}