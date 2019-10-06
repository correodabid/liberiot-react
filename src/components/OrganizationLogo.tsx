import React, { Component } from "react";


interface IProps {
    logo?: string
};

interface IState {

}

export class OrganizationLogo extends Component<IProps, IState> {

    render() {
        const { logo } = this.props
        return (
            <div style={{ textAlign: 'center' }}>
                <img height={100} style={{ maxWidth: '95%', objectFit: 'contain' }} src={logo} alt='logo'/>
            </div>
        )
    }
}