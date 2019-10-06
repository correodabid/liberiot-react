import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { Icon, Button } from "antd";
import '../Login/login.scss'
import { inject } from "mobx-react";
import { CredentialStore } from "../../stores";

interface IProps extends RouteComponentProps<any> {
    CredentialStore: CredentialStore
};

interface IState {
    credentialId: string,
    confirmed: boolean
}

@inject('CredentialStore')
export default class ConfirmPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            confirmed: false,
            credentialId: this.props.match.params.credentialId
        };
    }

    componentDidMount() {
        this.confirmEmail()
    }

    confirmEmail = async () => {
        let credential: any = { credentialId: this.state.credentialId }
        try {
            await this.props.CredentialStore.confirmEmail(credential);
            await this.setState({ confirmed: true })
        } catch (err) {
            await this.setState({ confirmed: false })
        }
    }

    render() {
        const { confirmed } = this.state

        return (
            <div id="login">
                <div className="login_wrapper">
                    <div className="login_content">
                        <div className='title'>
                            <h1>liberiot <b style={{ color: '#ff3333' }}>RED</b></h1>
                        </div>
                        <div style={{ margin: '2em' }}>
                            {confirmed ? 'Hello there young child, your email has been confirmed' : 'An error has ocurred'}
                        </div>
                        <div>
                            <Button shape="round" onClick={() => this.props.history.replace('/')}>Go Login</Button>
                        </div>
                        <div className='footer'>
                            <div className='title hide-effect'>
                                <h1><Icon type="rocket" />  liberiot <b>RED</b></h1>
                            </div>
                            <p>©{new Date().getFullYear()} All Rights Reserved by <a href="http://www.liberiot.org/" target="_blank" rel="noopener noreferrer">Liberiot</a></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}