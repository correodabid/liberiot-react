import React, { Component } from "react";
import { inject } from "mobx-react";

import { Button, Input, Form as AntForm, AutoComplete, Spin } from "antd";
import { SelectValue } from "antd/lib/select";

import { Formik, Field, FieldProps, Form, FormikProps, FormikActions } from "formik";
import { string, object as yupObject } from 'yup';
import { InputError } from '../'

import { ProfileStore } from "../../stores";
import Profile from "../../models/profile.model";

interface IProps {
    ProfileStore?: ProfileStore;
    onCancel(): void;
    onSumbit(values: Profile, formikActions: FormikActions<Profile>): Promise<void>
}
interface IState {
    isLoading: boolean
    profilesByEmail: Array<Profile>
}

@inject('ProfileStore')
export class AddForm extends Component<IProps, IState> {
    state = {
        isLoading: true,
        profilesByEmail: []
    }

    async  componentDidMount() {
        await this.filterProfilesByEmail(undefined)
    }

    filterProfilesByEmail = async (email: any) => {
        await this.setState({ isLoading: true, profilesByEmail: [] })
        const profilesByEmail = await this.props.ProfileStore!.getProfilesByEmail({ email });
        await this.setState({ profilesByEmail, isLoading: false })
    }

    handleSearchByEmail = async (value: SelectValue, formikProps: FormikProps<Profile>) => {
        const { profilesByEmail } = this.state;
        const profile: any = profilesByEmail.find((d: Profile) => d._id === value);

        if (!value) {
            formikProps.resetForm();
            await this.filterProfilesByEmail(undefined)
        } else if (!profile) {
            formikProps.setFieldValue('email', value)
            await this.filterProfilesByEmail(value)
        }
        else {
            formikProps.resetForm({
                _id: profile._id,
                email: profile.email,
                first_name: profile.first_name,
                last_name: profile.last_name
            })
        }
    }

    render() {
        const { isLoading } = this.state;

        const autoCompleteOptions = this.state.profilesByEmail.map((profile: Profile) =>
            <AutoComplete.Option key={profile._id}>{profile.email}</AutoComplete.Option>
        )

        return (
            <Formik enableReinitialize
                initialValues={{ email: undefined, first_name: undefined, last_name: undefined }}
                validationSchema={yupObject().shape({
                    email: string().email('Email invalid').required('The email is required'),
                    first_name: string().required('The fist name is required'),
                    last_name: string().required('The last name is required')
                })}
                onSubmit={this.props.onSumbit}
                render={(formikProps: FormikProps<Profile>) => (
                    <Form>
                        <AntForm.Item >
                            <Field name="email" render={({ field }: FieldProps) => (
                                <AutoComplete {...field} allowClear placeholder="Email"
                                    onChange={(value) => this.handleSearchByEmail(value, formikProps)}
                                    notFoundContent={isLoading ? <Spin /> : null}
                                    dataSource={autoCompleteOptions}
                                    autoFocus
                                    onBlur={(e) => { }}
                                />
                            )} />
                            <InputError title={'email'} />
                        </AntForm.Item>
                        <AntForm.Item>
                            <Field name="first_name" render={({ field }: FieldProps) => (
                                <Input {...field} placeholder="First Name" type="text" />
                            )} />
                            <InputError title={'first_name'} />
                        </AntForm.Item>
                        <AntForm.Item>
                            <Field name="last_name" render={({ field }: FieldProps) => (
                                <Input {...field} placeholder="Last Name" type="text" />
                            )} />
                            <InputError title={'last_name'} />
                        </AntForm.Item>
                        <AntForm.Item style={{ textAlign: 'center' }}>
                            <Button className='save-button' shape="round"
                                htmlType="submit" loading={formikProps.isSubmitting}>
                                Add
                            </Button>
                            <Button style={{ marginLeft: '.5em' }} shape="round" onClick={this.props.onCancel} >
                                Cancel
                            </Button>
                        </AntForm.Item>
                    </Form>
                )}
            />)
    }
}