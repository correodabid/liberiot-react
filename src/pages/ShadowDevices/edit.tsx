import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { inject, observer } from "mobx-react";
import { Divider, Card, Form as AntForm, Input, Button, message, List, Modal, Icon, Popconfirm } from "antd";
import { Formik, FormikProps, Form, Field, FieldProps, FormikActions } from "formik";
import { object, string } from "yup";

import { TitlePageComponent, InputError } from "../../components";

import ShadowDevice from "../../models/shadow-device.model";
import { ShadowDeviceStore } from "../../stores";
import { AddSample } from "./addSample";

type IProps = RouteComponentProps<{ shadowDeviceId: string }> & {
    ShadowDeviceStore: ShadowDeviceStore
}

@inject('ShadowDeviceStore')
@observer
export class EditShadowDevicePage extends Component<IProps> {

    async componentDidMount() {
        await this.props.ShadowDeviceStore.getShadowDevice(this.props.match.params.shadowDeviceId)
    }

    handleSubmit = async (values: ShadowDevice, formikActions: FormikActions<ShadowDevice>) => {
        formikActions.setSubmitting(true)
        try {
            await this.props.ShadowDeviceStore.editShadowDevice(values);
            formikActions.setSubmitting(false);
            message.success('Updated!')
            // this.props.history.goBack();
        } catch (error) {
            message.error('Error')
            formikActions.setSubmitting(false)
        }
    }

    handleTry = async (shadowDevice: ShadowDevice) => {
        try {
            await this.props.ShadowDeviceStore.tryShadowDevice(shadowDevice._id!)
            message.success('All went well!')
        } catch (error) {
            message.error('Error testing shadow device.')
        }
    }

    handleDeleteSample = async (_id: string) => {
        const shadowEdit = this.props.ShadowDeviceStore.selectedShadowDevice;
        if (shadowEdit && shadowEdit.samples) {
            const index = shadowEdit.samples.findIndex(sample => sample._id === _id)
            shadowEdit.samples.splice(index, 1)
            await this.props.ShadowDeviceStore.editShadowDevice(shadowEdit);
        }
    }

    render() {
        const { history } = this.props;
        const { selectedShadowDevice, isModalVisible } = this.props.ShadowDeviceStore;

        const validationSchema = object().shape({
            name: string().required('The name is required')
        })

        return (
            <Card>
                <TitlePageComponent title={(selectedShadowDevice && selectedShadowDevice.name) || 'Edit'}
                    description='Edit your shadow device.' history={history} extra={
                        <Button onClick={() => this.handleTry(selectedShadowDevice!)}>Test it!</Button>
                    } />
                <Divider style={{ margin: '0 0 1em 0' }} />
                {
                    selectedShadowDevice &&
                    <Formik initialValues={selectedShadowDevice} enableReinitialize
                        validationSchema={validationSchema}
                        onSubmit={this.handleSubmit}
                        render={({ values, isSubmitting }: FormikProps<ShadowDevice>) =>
                            <Form className='edit-form'>
                                <AntForm.Item label="Name" style={{ textAlign: 'left' }} required>
                                    <Field name="name" render={({ field }: FieldProps) => (
                                        <Input {...field} placeholder="Name" />
                                    )} />
                                    <InputError title='name' />
                                </AntForm.Item>
                                <List itemLayout='vertical' dataSource={selectedShadowDevice.samples} className='shadow-samples-list'
                                    header={(
                                        <div>
                                            <div className='ant-form-item-label'>
                                                <label>Samples</label>
                                            </div>
                                            <Button shape='round' icon='plus' style={{ color: '#1890ff' }}
                                                onClick={() => this.props.ShadowDeviceStore.changeIsModalVisible()} />
                                        </div>
                                    )}
                                    renderItem={(item) => (
                                        <List.Item key={item._id} extra={
                                            <Popconfirm
                                                title="Are you sure delete this sample?"
                                                onConfirm={() => this.handleDeleteSample(item._id!)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Icon type='delete' theme="twoTone" twoToneColor='#ff0000' />
                                            </Popconfirm>

                                        }>
                                            <b style={{ marginRight: '.5em' }}>Type:</b>{item.type}
                                            <br />
                                            <b style={{ marginRight: '.5em' }}>Name:</b>{item.name}
                                        </List.Item>
                                    )}
                                />
                                {/* <InputError title='name' /> */}
                                <AntForm.Item style={{ textAlign: 'center', marginTop: '1em' }}>
                                    <Button disabled={isSubmitting} loading={isSubmitting} htmlType="submit" className='save-button' shape='round'>Save</Button>
                                    <Button onClick={() => history.goBack()} style={{ marginLeft: 8 }} shape='round' > Cancel</Button>
                                </AntForm.Item>
                            </Form>
                        }
                    />
                }
                <Modal title={`Add sample`} visible={isModalVisible} footer={null} destroyOnClose
                    onCancel={() => this.props.ShadowDeviceStore.changeIsModalVisible()}>
                    <AddSample />
                </Modal>
            </Card >
        )
    }
}