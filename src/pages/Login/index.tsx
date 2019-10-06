import React, { Component } from "react";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { Form as AntForm, Input, Button, message, Icon } from "antd";
import { Formik, Form, Field, FieldProps, FormikActions, FormikProps } from "formik";
import { string, object } from 'yup';

import { InputError } from "../../components";

import Profile from "../../models/profile.model";
import { observer, inject } from "mobx-react";
import { AuthStore } from "../../stores";
import { IDataForm } from "../../models/interfaces";


interface IProps extends RouteComponentProps<any> {
    AuthStore: AuthStore
};

interface IState {
    data: IDataForm
}

@inject('AuthStore')
@observer
export default class LoginPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            data: {
                email: '',
                password: ''
            }
        };

        if (this.props.AuthStore.isUserLoggedIn) {
            this.props.history.replace('/profiles')
        }
    }

    submitLogin = async (values: IDataForm, actions: FormikActions<IDataForm>) => {
        const { history, AuthStore } = this.props;
        actions.setSubmitting(true);
        try {
            const profiles: Array<Profile> = await AuthStore.login(values);
            if (profiles.length === 1 && profiles[0]._id) {
                await AuthStore.selectProfile(profiles[0]._id)
                history.replace('/organization');
            } else {
                history.replace('/profiles');
            }
            return;
        } catch (error) {
            message.error('error');
        }
        actions.setSubmitting(false);
    }

    render() {
        const { data } = this.state;

        const validationSchema = {
            email: string().email('Email invalid').required('The email is required'),
            password: string().required('The password is required')
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
                            onSubmit={this.submitLogin}
                            render={({ isSubmitting, isValid }: FormikProps<IDataForm>) => (
                                <Form>
                                    <AntForm.Item >
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
                                    <AntForm.Item className="red-btn">
                                        <Button htmlType="submit" disabled={!isValid || isSubmitting} loading={isSubmitting}>
                                            Log in
                                        </Button>
                                    </AntForm.Item>
                                    <div className="mt10">
                                        <NavLink className="mt10" to="/remember-password">Lost your password?</NavLink>
                                    </div>
                                    <div className="separator">
                                        <div className="mb10">
                                            <NavLink to="/signup">New to site? Create Account</NavLink>
                                        </div>
                                        <div className="clearfix" />
                                        <br />
                                    </div>
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