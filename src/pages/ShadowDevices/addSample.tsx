import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Form as AntForm, Input, Button, Select } from "antd";
import { Formik, FormikProps, Form, Field, FieldProps, FormikActions } from "formik";
import { object, string } from "yup";
import { InputError } from "../../components";
import { ShadowDeviceStore } from "../../stores";

interface IProps {
    ShadowDeviceStore?: ShadowDeviceStore
}

interface IState {
    initialValues: ISample
}

interface ISample {
    type?: 'number' | 'string' | 'boolean',
    name?: string
}

@inject('ShadowDeviceStore')
@observer
export class AddSample extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            initialValues: {
                type: undefined,
                name: undefined
            }
        }
    }

    handleSubmit = async (values: ISample, formikActions: FormikActions<ISample>) => {
        const { ShadowDeviceStore } = this.props;
        if (ShadowDeviceStore) {
            formikActions.setSubmitting(true)

            let edited = ShadowDeviceStore.selectedShadowDevice;

            if (edited && edited.samples)
                edited.samples.push(values)
            else {
                edited!.samples = [values]
            }

            await ShadowDeviceStore.editShadowDevice(edited!);
            ShadowDeviceStore.changeIsModalVisible();

            formikActions.setSubmitting(false)
        }
    }

    render() {
        const { initialValues } = this.state;
        return (
            <Formik initialValues={initialValues} enableReinitialize
                validationSchema={object().shape({
                    type: string().required('The type is required'),
                    name: string().required('The name is required')
                })}
                onSubmit={this.handleSubmit}
                render={({ values, isSubmitting, setFieldValue }: FormikProps<ISample>) =>
                    <Form>
                        <AntForm.Item label="Name" style={{ textAlign: 'left' }} required>
                            <Field name="name" render={({ field }: FieldProps) => (
                                <Input {...field} value={values.name} placeholder="Name" />
                            )} />
                            <InputError title='name' />
                        </AntForm.Item>
                        <AntForm.Item label="Type" style={{ textAlign: 'left' }} required>
                            <Field name="type" render={({ field }: FieldProps) => (
                                <Select {...field} value={values.type} placeholder="Select a type" showSearch
                                    onChange={(value) => setFieldValue('type', value)}>
                                    <Select.Option key='string'>string</Select.Option>
                                    <Select.Option key='number'>number</Select.Option>
                                    <Select.Option key='boolean'>boolean</Select.Option>
                                </Select>
                            )} />
                            <InputError title='name' />
                        </AntForm.Item>
                        <AntForm.Item style={{ textAlign: 'center', marginTop: '1em' }}>
                            <Button htmlType="submit" className='save-button' disabled={isSubmitting} shape='round'>Add</Button>
                            <Button onClick={() => this.props.ShadowDeviceStore!.changeIsModalVisible()}
                                style={{ marginLeft: 8 }} shape='round'>Cancel</Button>
                        </AntForm.Item>
                    </Form>
                }
            />
        )
    }
}