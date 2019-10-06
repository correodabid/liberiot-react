import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Card, Divider, Form as AntForm, Input, Button, message } from "antd";
import { Formik, FormikProps, Form, Field, FieldProps, FormikActions } from "formik";
import { object, string } from "yup";

import { TitlePageComponent, InputError } from "../../components";

import Key from "../../models/key.model";

import { KeyStore } from "../../stores";


interface IProps extends RouteComponentProps<{ organizationId: string, apiId: string }> {
    KeyStore: KeyStore
}

interface IState {
    fetch: boolean;
}

@inject('KeyStore') @observer
export class EditApiPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            fetch: false,
        }
    }

    async componentDidMount() {
        const { apiId } = this.props.match.params;

        await this.props.KeyStore.getKey(apiId)
    }

    handleSubmit = async (values: Key, formikActions: FormikActions<Key>) => {
        try {
            formikActions.setSubmitting(true)
            await this.props.KeyStore.editKey(values);
            formikActions.setSubmitting(false);
            this.props.history.goBack()
        } catch (error) {
            formikActions.setSubmitting(false);
            message.error('Error to edit secret')
        }
    }

    render() {
        const { history } = this.props;
        const { selectedKey } = this.props.KeyStore

        return (
            <Card>
                <TitlePageComponent title='API' description={`Edit secret`} history={history} />
                <Divider />
                <Formik initialValues={selectedKey || {}} enableReinitialize
                    validationSchema={object().shape({
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
                                <Button disabled={isSubmitting} shape='round' className='save-button' loading={isSubmitting} htmlType="submit">Save</Button>
                                <Button onClick={() => history.goBack()} style={{ marginLeft: 8 }} shape='round' > Cancel</Button>
                            </AntForm.Item>
                        </Form>
                    }
                />
            </Card>
        )
    }
}