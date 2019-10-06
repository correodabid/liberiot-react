import React, { Component } from "react";
import { Menu, Affix, Modal, Col, Dropdown, Divider } from 'antd';
// import { logout } from "../../api/auth";
import { Link, RouteComponentProps } from 'react-router-dom';
import Profile from "../../models/profile.model";

import './navbar.scss'
import UserAvatar from "../UserAvatar";
import { AuthStore } from "../../stores";
import { inject, observer } from "mobx-react";

const confirm = Modal.confirm;

interface IProps extends RouteComponentProps<any> {
    AuthStore?: AuthStore,
    profile?: Profile
}

interface IState {
    selectedKeys: Array<string>
}

@inject('AuthStore')
@observer
export class LiberiotNavbar extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = { selectedKeys: [] }
    }

    logout = () => {
        const { history, AuthStore } = this.props;

        confirm({
            title: 'Exit',
            content: 'Are you sure you want to exit?',
            okType: 'danger',
            okText: 'Logout',
            cancelText: 'Cancel',
            maskClosable: true,
            onOk: async () => {
                AuthStore!.logout();
                await history.replace('/')
            }
        });
    }

    isVisible = () => {
        const { location } = this.props;

        if (location.pathname.includes('profiles')) {
            return 'none';
        }
        return 'inherit'
    }

    render() {
        const { location, AuthStore } = this.props;

        const profile: Profile = AuthStore!.selectedProfile

        const menu = (
            <Menu style={{ width: '200px', textAlign: 'right' }}>
                <Menu.Item style={{ cursor: 'pointer' }} disabled><Divider orientation="right">My settings</Divider></Menu.Item>
                <Menu.Item key="profile"><Link to="/profile">My profile</Link></Menu.Item>
                <Menu.Item key="profiles"><Link to="/profiles">Change profile</Link></Menu.Item>
                <Menu.Item onClick={() => this.logout()} key="logout">Log out</Menu.Item>
            </Menu>
        );

        return (
            <Affix>
                <div className="navbar">
                    <Col span={6}>
                        <Link to='/organization' >
                            <div className="logo" >
                                &nbsp;liberiot&nbsp;<b style={{ color: '#ff3333' }}>RED</b>
                            </div>
                        </Link>
                    </Col>
                    <Col span={12} style={{ display: this.isVisible() }}>
                    </Col>
                    <Col span={6}>
                        {profile && !location.pathname.includes('profiles') &&
                            <Dropdown overlay={menu} trigger={['click']} >
                                <span style={{ float: 'right', color: 'inherit', margin: '6px 15px 0 0', textDecoration: 'none', cursor: 'pointer' }}>
                                    <UserAvatar user={profile} fontSize={"1em"} size={28} />
                                    <span className="no-name">{profile.first_name}</span>
                                </span>
                            </Dropdown>
                        }
                    </Col>
                </div>
            </Affix>
        )
    }
}