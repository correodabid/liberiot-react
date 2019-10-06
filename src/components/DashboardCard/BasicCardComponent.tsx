import React, { Component } from "react";
import { Card } from "antd";
import { capitalize } from "lodash";
import { CardFooterComponent } from "./CardFooter";
import { Link } from "react-router-dom";
import Profile from "../../models/profile.model";
import { inject, observer } from "mobx-react";
import { ProfileStore } from "../../stores";

interface IProps {
    ProfileStore?: ProfileStore
    name?: string,
    id: string,
    type: string
    members?: Array<any>
}

interface IState {
    users: Array<Profile>
}

@inject('ProfileStore') @observer
export class BasicCardComponent extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = { users: [] }
    }

    componentDidMount() {
        if (this.props.type === 'organization')
            this.getOrganizationUsers();
        else if (this.props.members)
            this.setState({ users: this.props.members })
    }

    getOrganizationUsers = async () => {
        this.props.ProfileStore!.getUsers()
    }

    render() {
        const { name, id, type, members } = this.props;
        const { users } = this.props.ProfileStore!

        return (
            <Link to={`/${type}/${id}`}>
                <Card style={styles.customCard} >
                    <p style={{ textAlign: 'left', fontSize: '1.2em' }}><b>{capitalize(name && name.toLowerCase())}</b></p>
                    <CardFooterComponent members={members ? members : users.docs} total={members ? members.length : users.total} />
                </Card>
            </Link>
        )
    }
}
const styles = {
    customCard: {
        margin: '2vh 1vw 2vh 1vw',
        height: '15vh',
        borderRadius: '2vh',
    }
}
