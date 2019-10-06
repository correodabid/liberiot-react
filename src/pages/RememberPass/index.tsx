import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { Form as AntForm, Input, Button, Icon, message } from "antd";
import { Formik, Form, Field, FieldProps, FormikActions, FormikProps } from "formik";
import { string, object } from 'yup';

import { InputError } from "../../components";
import { inject } from "mobx-react";
import { AuthStore } from "../../stores";


interface IProps extends RouteComponentProps<any> {
    AuthStore: AuthStore
};

interface IState {

}
@inject('AuthStore')
export default class RememberPassword extends Component<IProps, IState> {

    send = async (values: { email: string }, formikActions: FormikActions<{ email: string }>) => {
        formikActions.setSubmitting(true)
        try {
            this.props.AuthStore.rememberPassword(values)
            message.success('Email sent')
            this.props.history.replace('/')
        } catch (error) {
            message.error('An error has ocurred')
        }
        formikActions.setSubmitting(false)
    }

    render() {
        const validationSchema = {
            email: string().email('Invalid email').required('An email is required'),
        }
        return (
            <div id="login">
                <div className="login_wrapper">
                    <div className="login_content">
                        <div className='title'>
                            <h1>liberiot <b style={{ color: '#ff3333' }}>RED</b></h1>
                        </div>
                        <Formik enableReinitialize
                            initialValues={{ email: '' }}
                            validationSchema={object().shape(validationSchema)}
                            onSubmit={this.send}
                            render={({ isSubmitting, isValid }: FormikProps<{ email: string }>) => (
                                <Form style={{ paddingTop: '2em' }}>
                                    <AntForm.Item>
                                        <Field name="email" render={({ field }: FieldProps) => (
                                            <Input {...field} placeholder="Email" type="email" />
                                        )} />
                                        <InputError title={'email'} />
                                    </AntForm.Item>
                                    <AntForm.Item>
                                        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '2em' }}>
                                            <Button type='danger' onClick={() => this.props.history.goBack()}>Cancel</Button>
                                            <Button htmlType="submit"  disabled={!isValid || isSubmitting} loading={isSubmitting}>
                                                Send me an email
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