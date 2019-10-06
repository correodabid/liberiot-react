import React, { Component } from "react";
import { Button } from "antd";
import { inject, observer } from "mobx-react";

import UserAvatar from "../UserAvatar";

import Profile from "../../models/profile.model";
import { AuthStore } from "../../stores";

interface IProps {
    AuthStore?: AuthStore,
    data: Array<Profile>,
    total: number
    onClick?: Function
}

interface IState {
}
@inject('AuthStore')
@observer
export class DetailUsersComponent extends Component<IProps, IState> {

    handleClick = async () => {
        if (this.props.onClick)
            this.props.onClick();
    }

    render() {
        const maxUsers = 4;
        const { data, total } = this.props
        const { selectedProfile } = this.props.AuthStore!

        return (
            <div style={{ textAlign: 'center' }}>
                {data && data.map((user: Profile, index: number) => {
                    return index < maxUsers &&
                        <UserAvatar showTooltip={true} key={index} user={user} />
                }
                )}
                {total > maxUsers &&
                    <span style={{ marginLeft: '.5em', fontSize: '.8em' }}>
                        {total - maxUsers} more
                    </span>
                }
                {selectedProfile.is_admin && <Button onClick={() => this.handleClick()} style={{ marginLeft: '1em' }} shape="round">
                    Add/remove people
                </Button>
                }
            </div>
        )
    }
}