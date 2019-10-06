import React, { Component } from "react";
import Profile from "../../models/profile.model";
import UserAvatar from "../UserAvatar";


interface IProps {
    members: Array<Profile>,
    total: number
}

interface IState {

}

export class CardFooterComponent extends Component<IProps, IState> {

    render() {
        const maxUsers = 4;
        const { members, total } = this.props

        return (
            <footer style={{ position: 'absolute', right: 0, bottom: 0, left: 0, padding: '.5em', textAlign: 'left' }}>
                {members && members.map((user: Profile, index: number) => {
                    return index < maxUsers &&
                        <UserAvatar showTooltip={true} key={index} user={user} size={24} fontSize={"1em"} />
                }
                )}
                {total > maxUsers &&
                    <span style={{ marginLeft: '.5em', fontSize: '.8em' }}>
                        {total - maxUsers} more
                    </span>
                }
            </footer>
        )
    }
}