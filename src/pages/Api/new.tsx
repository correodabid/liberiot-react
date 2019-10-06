import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { inject, observer } from "mobx-react";
import { Card, Divider, Form as AntForm, Input, Button, message } from "antd";
import { Formik, FormikProps, Form, Field, FieldProps, FormikActions } from "formik";
import { object, string } from "yup";

import { TitlePageComponent, InputError } from "../../components";

import Key from "../../models/key.model";

import { KeyStore } from "../../stores";

interface IProps extends RouteComponentProps<{ organizationId: string }> {
    KeyStore: KeyStore
}

@inject('KeyStore') @observer
export class NewApiPage extends Component<IProps> {

    handleSubmit = async (values: Key, formikActions: FormikActions<Key>) => {
        try {
            formikActions.setSubmitting(true)
            await this.props.KeyStore.addKey(values);
            formikActions.setSubmitting(false);
            this.props.history.goBack()
        } catch (error) {
            formikActions.setSubmitting(false);
            message.error('Error to generate new secret')
        }
    }

    render() {
        const { history } = this.props;

        return (
            <Card>
                <TitlePageComponent title='API' description={`Generate a new secret`} history={history} />
                <Divider />
                <Formik initialValues={{}} enableReinitialize
                    validationSchema={object().shape({
                        type: string(),
                        name: string().required('The name is required')
                    })}
                    onSubmit={this.handleSubmit}
                    render={({ values, isSubmitting }: FormikProps<Key>) =>
                        <Form className='small-form'>
                            <AntForm.Item label="Name" style={{ textAlign: 'left' }}>
                                <Field name="name" render={({ field }: FieldProps) => (<Input {...field}
                                    value={values.name} placeholder="Name" type="text" />)} />
                                <InputError title='name' />
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