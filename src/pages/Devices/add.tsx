import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { inject, observer } from "mobx-react";

import { Form as AntForm, Input, Button, message, Card, Radio } from "antd";
import { Formik, Form, Field, FormikProps, FieldProps, FormikActions } from "formik";
import { string, object } from "yup";

import { TitlePageComponent, InputError } from "../../components";

import Device from "../../models/device.model";

import { DeviceStore } from "../../stores";

interface IMatchParams {
    deviceId: string;
    organizationId: string;
}

interface IProps extends RouteComponentProps<IMatchParams> {
    DeviceStore: DeviceStore
}

interface IState {
    newDevice: Device
}

@inject('DeviceStore')
@observer
export class AddDevicePage extends Component<IProps, IState> {
    state: IState = {
        newDevice: { organization: this.props.match.params.organizationId }
    }

    handleSubmit = async (values: Device, actions: FormikActions<Device>) => {
        const { addDevice } = this.props.DeviceStore;
        actions.setSubmitting(true);

        try {
            await addDevice(values)
            this.props.history.goBack();
        } catch (error) {
            message.error('Error. The device could not be created.')
        }
        actions.setSubmitting(false);
    }

    render() {
        const { history } = this.props;
        const { isLoading } = this.props.DeviceStore;
        const { newDevice } = this.state;

        return (
            <Card loading={isLoading}>
                <TitlePageComponent title={`Devices`} description='Create a new device.' history={history} />
                <Formik initialValues={newDevice} enableReinitialize
                    validationSchema={object()
                        .shape({
                            name: string().required('The name is required'),
                            mac: string().required('The mac is required')
                        })}
                    onSubmit={this.handleSubmit}
                    render={({ values, isSubmitting, setFieldValue }: FormikProps<Device>) =>
                        <Form className='small-form'>
                            <AntForm.Item label="Name" style={{ textAlign: 'left' }}>
                                <Field name="name" render={({ field }: FieldProps) => (
                                    <Input {...field} value={values.name} placeholder="Name" />
                                )} />
                                <InputError title='name' />
                            </AntForm.Item>
                            <AntForm.Item label="MAC" style={{ textAlign: 'left' }}>
                                <Field name="mac" render={({ field }: FieldProps) => (
                                    <Input {...field} value={values.mac} placeholder="MAC" />
                                )} />
                                <InputError title='mac' />
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