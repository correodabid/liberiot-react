import React, { Component } from "react";
import Profile from "../models/profile.model";
import { Tooltip, Avatar } from "antd";
import { getAvatarString } from "../utils/util";

interface IProps {
    user: Profile,
    showTooltip?: boolean,
    fontSize?: string,
    margin?: number,
    size?: number
}

interface IState {
    backgroundColor?: string
}

export default class UserAvatar extends Component<IProps, IState>{
    static defaultProps = {
        showTooltip: false,
        fontSize: '1.3em',
        margin: '.2em',
        size: 42
    }

    constructor(props: IProps) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        if (this.props.user && this.props.user.first_name && this.props.user.last_name) {
            this.setState({ backgroundColor: '#' + this.intToRGB(this.hashCode(this.props.user.first_name)) })
        }
    }

    hashCode(str: string): number {
        let hash: number = 0;
        for (let i: number = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    intToRGB(i: number): string {
        const c: string = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        return "00000".substring(0, 6 - c.length) + c;
    }

    render() {
        const { backgroundColor } = this.state
        const { fontSize, margin, size, user } = this.props

        if (user) {
            if (this.props.showTooltip) {
                return (
                    <Tooltip data-test="avatar-tooltip" title={`${user.first_name} ${user.last_name}${user.is_admin ? ', Admin' : ''}`}>
                        <Avatar style={{ backgroundColor, fontSize, margin }} size={size}>
                            {user.first_name && user.last_name && getAvatarString(user.first_name, user.last_name)}
                        </Avatar>
                    </Tooltip>
                );
            } else {
                return (
                    <Avatar data-test="avatar" style={{ backgroundColor, fontSize, margin }} size={size}>
                        {user.first_name && user.last_name && getAvatarString(user.first_name, user.last_name)}
                    </Avatar>
                );
            }
        } else {
            return null
        }

    }

}

