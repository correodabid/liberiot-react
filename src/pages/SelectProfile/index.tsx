import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { Card } from "antd";
import { inject, observer } from "mobx-react";

import { DividerComponent } from "../../components/DividerComponent";
import { LoadingComponent } from "../../components/LoadingComponent";

import Profile from "../../models/profile.model";
import { AuthStore, ProfileStore } from "../../stores";

interface IProps extends RouteComponentProps {
    AuthStore: AuthStore
    ProfileStore: ProfileStore
}

@inject('AuthStore', 'ProfileStore')
@observer
export default class SelectProfilePage extends Component<IProps, {}> {

    async  componentDidMount() {
        this.props.ProfileStore.getProfilesByCredential()
    }

    selectProfile = async (profile: Profile) => {
        if (profile._id) {
            await this.props.AuthStore.selectProfile(profile._id)
            this.props.history.replace('/organization');
        }
    }

    render() {
        const { profiles, isLoading } = this.props.ProfileStore;

        if (isLoading) return <LoadingComponent />
        return (
            <Card style={{ padding: '1em' }}>
                <DividerComponent title="Select a profile" />
                <div style={{ display: 'flex', flexWrap: 'wrap', width: '80%', margin: '0 auto', justifyContent: 'center' }}>
                    {
                        profiles.map((profile: Profile, index: number) => (
                            <Card key={index.toString()} onClick={() => this.selectProfile(profile)} hoverable
                                style={{ margin: '1em', borderRadius: 10, padding: '1em' }} bodyStyle={{ fontSize: '1.2em' }}>
                                {profile.first_name} {profile.is_owner && '(Owner)'}
                                <br />
                                <small> {profile.is_admin ? 'Admin' : 'Dev'} at {profile.organization!.name} </small>
                            </Card>
                        ))
                    }
                </div>
            </Card>
        )
    }
}