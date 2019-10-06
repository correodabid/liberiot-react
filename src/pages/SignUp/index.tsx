import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { Form as AntForm, Input, Button, Icon, message } from "antd";
import { Formik, Form, Field, FormikActions, FieldProps, FormikProps } from "formik";
import { string, object, ref } from 'yup';

import "../Login/login.scss";

import { InputError } from "../../components";
import { ISignUpRequest } from "../../models/interfaces";
import { AuthStore } from "../../stores";
import { inject } from "mobx-react";

interface IProps extends RouteComponentProps<any> {
    AuthStore: AuthStore
};

interface IState {
    data: ISignUpRequest,
    submitting: boolean
}
@inject('AuthStore')
export default class SignUpPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            data: {
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                repeat_password: '',
                organization: '',
                is_admin: true,
                is_owner: true
            },
            submitting: false
        };
    }

    signUp = async (values: ISignUpRequest, formikActions: FormikActions<ISignUpRequest>) => {
        formikActions.setSubmitting(true)
        try {
            await this.props.AuthStore.signUp(values)
            message.success('A confirmation email has been sent to your account')
            this.props.history.replace('/')
        } catch (error) {
            message.error('Error adding user')
        }
        formikActions.setSubmitting(false)
    }

    render() {
        const { data } = this.state;

        const validationSchema = {
            first_name: string().required('The first name is required'),
            last_name: string().required('The last name is required'),
            email: string().email('Email invalid').required('The email is required'),
            organization: string().required('The organization is required'),
            password: string().required('The password is required'),
            repeat_password: string()
                .oneOf([ref('password')], "Passwords do not match")
                .required('The password is required')
        }
        return (
            <div id="login">
                <div className="login_wrapper">
                    <div className="login_content">
                        <div className='title'>
                            <h1>liberiot <b style={{ color: '#ff3333' }}>RED</b></h1>
                        </div>
                        <Formik enableReinitialize
                            initialValues={data}
                            validationSchema={object().shape(validationSchema)}
                            onSubmit={this.signUp}
                            render={({ isSubmitting, isValid }: FormikProps<ISignUpRequest>) => (
                                <Form style={{ paddingTop: '2em' }}>
                                    <AntForm.Item>
                                        <Field name="first_name" render={({ field }: FieldProps) => (
                                            <Input {...field} placeholder="First name" />
                                        )} />
                                        <InputError title={'first_name'} />
                                    </AntForm.Item>
                                    <AntForm.Item>
                                        <Field name="last_name" render={({ field }: FieldProps) => (
                                            <Input {...field} placeholder="Last name" />
                                        )} />
                                        <InputError title={'last_name'} />
                                    </AntForm.Item>
                                    <AntForm.Item>
                                        <Field name="organization" render={({ field }: FieldProps) => (
                                            <Input {...field} placeholder="Organization name" />
                                        )} />
                                        <InputError title={'organization'} />
                                    </AntForm.Item>
                                    <AntForm.Item>
                                        <Field name="email" render={({ field }: FieldProps) => (
                                            <Input {...field} placeholder="Email" type="email" />
                                        )} />

                                        <InputError title={'email'} />
                                    </AntForm.Item>
                                    <AntForm.Item>
                                        <Field name="password" render={({ field }: FieldProps) => (
                                            <Input {...field} placeholder="Password" type="password" />
                                        )} />
                                        <InputError title={'password'} />
                                    </AntForm.Item>
                                    <AntForm.Item>
                                        <Field name="repeat_password" render={({ field }: FieldProps) => (
                                            <Input {...field} placeholder="Repeat password" type="password" />
                                        )} />
                                        <InputError title={'repeat_password'} />
                                    </AntForm.Item>
                                    <AntForm.Item>
                                        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '2em' }}>
                                            <Button shape="round" onClick={() => this.props.history.goBack()}>Back</Button>
                                            <Button shape="round" type={"danger"} htmlType="submit" disabled={!isValid || isSubmitting} loading={isSubmitting}>
                                                Register
                                            </Button>
                                        </div>
                                    </AntForm.Item>
                                </Form>
                            )}
                        />
                        <div className='footer'>
                            <div className='title hide-effect'>
                                <h1><Icon type="rocket" />  liberiot <b>RED</b></h1>
                            </div>
                            <p>©{new Date().getFullYear()} All Rights Reserved by <a href="http://www.liberiot.org/" target="_blank" rel="noopener noreferrer">Liberiot</a></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}