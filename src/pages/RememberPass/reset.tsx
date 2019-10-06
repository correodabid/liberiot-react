import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { Form as AntForm, Input, Button, Icon, message } from "antd";
import { Formik, Form, Field, FormikActions, FieldProps, FormikProps } from "formik";
import { string, object, ref } from 'yup';
import { inject } from "mobx-react";

import "../Login/login.scss";

import { InputError } from "../../components";
import { AuthStore, CredentialStore } from "../../stores";

interface IReset {
    password: string,
    repeat_password: string
}

interface IProps extends RouteComponentProps<any> {
    AuthStore: AuthStore,
    CredentialStore: CredentialStore
};

interface IState {
    token: string,
    data: IReset,
    submitting: boolean
}
@inject('AuthStore', 'CredentialStore')
export default class ResetPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            token: this.props.match.params.randomToken,
            data: {
                password: '',
                repeat_password: ''
            },
            submitting: false
        };
    }

    reset = async (values: IReset, formikActions: FormikActions<IReset>) => {
        formikActions.setSubmitting(true)
        try {
            let object = { password: values.password, repeat_password: values.repeat_password, token: this.state.token }
            await this.props.CredentialStore.resetPassword(object)
            message.success('Password changed correctly')
            this.props.history.replace('/')
        } catch (error) {
            message.error('Error changing password')
        }
        formikActions.setSubmitting(false)
    }

    render() {
        const { data } = this.state;

        const validationSchema = {
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
                            onSubmit={this.reset}
                            render={({ values, isSubmitting }: FormikProps<IReset>) => (
                                <Form style={{ paddingTop: '2em' }}>
                                    <AntForm.Item>
                                        <Field name="password" render={({ field }: FieldProps) => (
                                            <Input value={values.password} {...field} placeholder="Password" type="password" />
                                        )} />
                                        <InputError title={'password'} />
                                    </AntForm.Item>
                                    <AntForm.Item>
                                        <Field name="repeat_password" render={({ field }: FieldProps) => (
                                            <Input value={values.repeat_password} {...field} placeholder="Repeat password" type="password" />
                                        )} />
                                        <InputError title={'repeat_password'} />
                                    </AntForm.Item>
                                    <AntForm.Item>
                                        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '2em' }}>
                                            <Button shape="round" type={"danger"} htmlType="submit" loading={isSubmitting}
                                                disabled={!values.password || !values.repeat_password || isSubmitting || values.password !== values.repeat_password}
                                            >
                                                Reset Password
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