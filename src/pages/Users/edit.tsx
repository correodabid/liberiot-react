import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { inject, observer } from "mobx-react";
import { Card, Input, Button, Form as aform, Switch, message } from "antd";
import { FormikActions, Formik, Form, Field, FormikProps, FieldProps } from "formik";
import { string, object } from "yup";

import { TitlePageComponent, InputError } from "../../components";

import { ProfileStore, AuthStore } from "../../stores";

import Profile from "../../models/profile.model";

interface IMatchParams {
    profileId: string;
}

interface IProps extends RouteComponentProps<IMatchParams> {
    ProfileStore: ProfileStore;
    AuthStore: AuthStore;
}

@inject('ProfileStore', 'AuthStore')
@observer
export default class EditProfile extends Component<IProps> {
    componentDidMount() {
        this.props.ProfileStore.getUser(this.props.match.params.profileId)
    }

    edit = async (values: Profile, actions: FormikActions<Profile>) => {
        try {
            const editedProfile: Profile = await this.props.ProfileStore.editProfile(values);
            if (this.props.AuthStore.selectedProfile._id === editedProfile._id) {
                await this.props.AuthStore.updateSelectedProfile(editedProfile)
            }
            this.props.history.goBack();
        } catch (error) {
            message.error('Error editing user')
        }
    }

    render() {
        const { history } = this.props;
        const { selectedProfile, isLoading } = this.props.ProfileStore;

        return (
            <Card loading={isLoading}>
                <TitlePageComponent title={`${selectedProfile.first_name} ${selectedProfile.last_name}`}
                    description='Edit user.' history={history} />

                <Formik initialValues={selectedProfile} enableReinitialize
                    validationSchema={object().shape({
                        first_name: string().required('The name is required'),
                        last_name: string().required('The last name is required'),
                    })}
                    onSubmit={this.edit}
                    render={({ values, isSubmitting, setFieldValue }: FormikProps<Profile>) =>
                        <Form className='small-form'>
                            <aform.Item label="Name">
                                <Field name="first_name" render={({ field }: FieldProps) => (
                                    <Input {...field} value={values.first_name} placeholder="Name" />
                                )} />
                                <InputError title='first_name' />
                            </aform.Item>
                            <aform.Item label="Last name">
                                <Field name="last_name" render={({ field }: FieldProps) => (
                                    <Input {...field} value={values.last_name} placeholder="Last name" />
                                )} />
                                <InputError title='last_name' />
                            </aform.Item>
                            <aform.Item label='Admin'>
                                <Field name="is_admin" render={({ field }: FieldProps) => (
                                    <Switch {...field} checkedChildren="Yes" unCheckedChildren="No" checked={values.is_admin}
                                        onChange={(checked: boolean) => setFieldValue('is_admin', checked)} />
                                )} />
                            </aform.Item>
                            <aform.Item style={{ textAlign: 'center' }}>
                                <Button disabled={isSubmitting} shape="round" className='save-button' htmlType="submit">Save</Button>
                                <Button shape="round" onClick={() => this.props.history.goBack()} style={{ marginLeft: 8 }} > Cancel</Button>
                            </aform.Item>
                        </Form>
                    }
                />
            </Card>
        )
    }
}