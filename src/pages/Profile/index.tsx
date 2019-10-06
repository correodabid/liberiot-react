import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { Row, Col, Card } from "antd";
import Usuario from '../../models/profile.model';

import './profile.scss'
import UserAvatar from '../../components/UserAvatar';
import { AuthStore } from '../../stores';
import { inject, observer } from 'mobx-react';

interface IProps extends RouteComponentProps<any> {
    AuthStore: AuthStore
}

interface IState {
    user?: Usuario,
    //   twoFactor?: boolean
}
@inject('AuthStore')
@observer
export default class UserProfilePage extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        this.fetchUser();
    }

    fetchUser = async () => {
        const user: Usuario = this.props.AuthStore.selectedProfile
        await this.setState({ user })
    }

    // change2Factor = async (action: string) => {
    //     let twoFactor: boolean;

    //     if (action === 'activate') twoFactor = true
    //     else twoFactor = false

    //     confirm({
    //         title: 'Warning',
    //         content: 'Are you sure you want to ' + action + '?',
    //         okType: 'danger',
    //         okText: action,
    //         cancelText: 'Cancel',
    //         maskClosable: true,
    //         onOk: async () => {
    //             this.setState({ twoFactor });
    //         }
    //     });
    // }

    render() {

        const { user } = this.state

        if (user)
            return (
                <Card data-test="profile">
                    <Col style={{ textAlign: 'center' }}>
                        <Row>
                            <UserAvatar showTooltip={true} user={user} />
                        </Row>
                        <Row>
                            <div >
                                <h3 style={styles.spanContent}>Información de {user.first_name} {user.last_name} </h3>
                                <div style={styles.spanTitle}>
                                    <b>Administrador:</b> {user.is_admin ? 'Si' : 'No'}
                                </div>
                            </div>
                            {/* <Card style={{ borderRadius: 15 }}
                                actions={twoFactor ?
                                    [<span onClick={() => this.change2Factor('desactivate')}>Desactivar</span>] :
                                    [<span onClick={() => this.change2Factor('activate')}>Activar</span>]}
                            >
                                <Meta title="Verificación en 2 pasos"
                                    description={twoFactor ? 'La verificación en dos pasos esta activada' : 'La verificación esta desactivada'}
                                />
                            </Card> */}
                        </Row>
                    </Col>
                </Card>
            )
        else return null;
    }
}

const styles = {
    spanTitle: {
        fontWeight: 100,
        fontSize: '1.1em',
        color: 'gray',
    },
    spanContent: {
        fontWeight: 600,
        fontSize: '2em'
    }
}

