import React, { Component } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';

import './sidebar.scss';

const { Sider } = Layout;

interface IProps extends RouteComponentProps<any> { }

interface IState {
    collapsed: boolean,
    selectedKey: string
}

export class LiberiotSidebar extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props);

        const path: Array<string> = this.props.location.pathname.split('/');

        this.state = {
            collapsed: false,
            selectedKey: path[1]
        }
    }

    onToggle = (collapsed: boolean) => {
        this.setState({ collapsed })
    }

    render() {
        const {  collapsed, selectedKey } = this.state;

        return (
            <Sider className="sidebar" collapsible={true} collapsed={collapsed} onCollapse={this.onToggle} width={230} >
                <Link to='/' className={`title ${collapsed ? 'center-icon p0' : ''}`} >
                    <Icon type="rocket" className="red-icon" />
                    <span className={`${collapsed ? 'hide-on-collpase' : ''}`}>
                        &nbsp;liberiot&nbsp;
                            <b style={{ color: '#ff3333' }}>RED</b>
                    </span>
                </Link>
                <Menu mode="inline" defaultSelectedKeys={[selectedKey]} style={{ borderRight: 0, backgroundColor: '#2A3F54' }} className="menu" >
                    <Menu.Item key="api">
                        <Link to={`/api`} style={{ textDecoration: 'none' }}>
                            <span><Icon type="cloud-download" /><span>API</span></span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="devices">
                        <Link to={`/devices`} style={{ textDecoration: 'none' }}>
                            <span><Icon type="mobile" /><span>Nodes</span></span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="gateways">
                        <Link to={`/gateways`} style={{ textDecoration: 'none' }}>
                            <span><Icon type="wifi" /><span>Gateways</span></span>
                        </Link>
                    </Menu.Item>
                </Menu>
            </Sider>)
    }
}