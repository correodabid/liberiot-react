import React, { Component } from "react";
import { Link } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { Card, Table, Icon, Button, Divider, Modal } from "antd";
import { ColumnProps } from "antd/lib/table";

import { TitlePageComponent, LiberiotBreadcrumbs } from "../../components";

import Key from "../../models/key.model";
import { inject, observer } from "mobx-react";
import { KeyStore } from "../../stores";

interface ILocationState {
    title: string;
}
interface IProps extends RouteComponentProps<{ organizationId: string }, any, ILocationState> {
    KeyStore: KeyStore
}

interface IState {
}

@inject('KeyStore') @observer
export default class ApiPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this.getKeys();
    }

    getKeys = async () => {
        this.props.KeyStore.getKeys({ populate: 'organization' });
    }

    handleDelete(key: Key) {
        Modal.confirm({
            title: 'Are you sure to delete this secret?',
            content: (
                <div style={{ padding: '1em 0' }}>
                    <h2>{key.name}</h2>
                    <p><b>Organization: </b>{key.organization && key.organization.name}</p>
                </div>
            ),
            okType: 'danger',
            okText: 'Delete',
            cancelText: 'Cancel',
            maskClosable: true,
            onOk: async () => {
                if (key._id) {
                    await this.props.KeyStore.deleteKey(key._id)
                    await this.getKeys()
                }
            }
        })
    }

    handleModal(selectedKey: Key) {
        Modal.info({
            title: `API Key ${selectedKey.name}`,
            content: (
                <div>
                    To connect the MQTT broker, use this key as MQTT ID.
                    <p></p>
                    In order to use the HTTP API, set a custom header named "auth" with this key.
                    <p></p>
                    <strong>{selectedKey.uuid}</strong>
                </div>
            ),
            onOk() { },
            onCancel() { }
        });
    }

    render() {
        const { keys, isLoading } = this.props.KeyStore;
        const { location } = this.props;

        const columns: Array<ColumnProps<Key>> = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            {
                title: 'Key', key: 'uuid', render: (text: any, record: Key) => (
                    <Button onClick={() => this.handleModal(record)}><Icon type={"eye"}></Icon></Button>
                )
            },
            { title: 'Organization', dataIndex: 'organization.name', key: 'organization.name' },
            {
                title: 'Action', key: 'action', className: 'nowrap',
                render: (text: any, record: Key) => (
                    <span>
                        <Link to={`${this.props.match.url}/${record._id}/edit`}><Icon type="edit" /></Link>
                        <Divider type='vertical' />
                        <button className='link' onClick={() => this.handleDelete(record)}><Icon type="delete" /></button>
                    </span>
                )
            }
        ]

        return (
            <div>
                <LiberiotBreadcrumbs {...this.props} />
                <Card>
                    <TitlePageComponent title='API' description={`Welcome to the ${location.state && location.state.title} API Keys management`}
                        extra={[
                            <Link to={`${this.props.match.url}/new`} key='new'>
                                <Button shape='round' icon='plus' type='primary' />
                            </Link>
                        ]} />
                    <Table rowKey={(row: Key, index: number) => row._id || index.toString()}
                        columns={columns} dataSource={keys.docs} loading={isLoading}
                        pagination={{ hideOnSinglePage: true, size: 'small' }} />
                </Card>

                {/* <Modal
                    title={`API Key ${this.state.selectedKey && this.state.selectedKey.name}`}
                    visible={this.state.modal}
                    onOk={() => this.setState({ modal: false })}
                    onCancel={() => this.setState({ modal: false })}>

                    {this.state.selectedKey && this.state.selectedKey.uuid}
                </Modal> */}

            </div>
        )
    }
}

export * from './new';
export * from './edit';