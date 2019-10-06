import React, { Component } from "react";
import { Button, Dropdown, Menu } from 'antd'
import { Link } from "react-router-dom";


interface IProps {
    onClickSetting: Function;
    organizationId?: string;
};

interface IState {
    remove?: boolean
}

export class SettingsButtonComponent extends Component<IProps, IState> {
    state = { remove: false }

    onClickSetting = async (key: any) => {
        this.props.onClickSetting(key)
        await this.setState({ remove: !this.state.remove })
    }

    render() {
        const { remove } = this.state
        const { organizationId } = this.props;
        const menu = (
            <Menu>
                {!remove && <Menu.Item onClick={(key) => this.onClickSetting(key)} key="delete">Remove projects</Menu.Item>}
                {!remove && <Menu.Item key="recycle_bin" className='hide-on-desktop'><Link to={`/organization/${organizationId}/trash`} >Recycle bin</Link></Menu.Item>}
                {remove && <Menu.Item onClick={(key) => this.onClickSetting(key)} key="cancel">Go back as cards</Menu.Item>}
            </Menu>
        );

        return (
            <Dropdown overlay={menu} trigger={['click']}>
                <Button shape="circle" icon="ellipsis" />
            </Dropdown>
        )
    }
}