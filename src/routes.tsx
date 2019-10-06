import React, { Component } from 'react';
import { Redirect, Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom';

import { Layout } from 'antd';

import { COOKIE_TOKEN } from './utils/constants';

import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';
import SelectProfilePage from './pages/SelectProfile';
import ApiPage, { NewApiPage, EditApiPage } from "./pages/Api";
import DevicesPage, { EditDevicePage, DeviceDetailPage ,AddDevicePage} from './pages/Devices';
import ShadowDevicesPage, {  EditShadowDevicePage } from "./pages/ShadowDevices";
import GatewaysPage, { GatewayDetailPage } from './pages/Gateways';
import EditGatewayPage from './pages/Gateways/edit';
import UserProfilePage from './pages/Profile';

import { LiberiotNavbar, LiberiotFooter } from "./components";
import OrganizationPage from './pages/Organization';
import OrganizationDetailPage from './pages/Organization/detail';
import EditPage from './pages/Organization/edit'
import RememberPassword from './pages/RememberPass';
import TrashPage from './pages/Trash';
import ConfirmPage from './pages/SignUp/confirm';
import { NotFoundComponent } from './components/NotFound';
import { ServerErrorComponent } from './components/ServerError';
import { DocumentationPage } from './pages/Documentation';
import ResetPage from './pages/RememberPass/reset';
import { UsersPage } from './pages/Users';
import EditProfile from './pages/Users/edit';

const { Content } = Layout;

interface IProps extends RouteComponentProps<any> {
}

interface IState {
}

class Router extends Component<IProps, IState> {
    render() {

        return (
            <Switch>
                <Route exact path="/" component={LoginPage} />
                <Route exact path="/confirm/:credentialId" component={ConfirmPage} />
                <Route exact path="/signup" component={SignUpPage} />
                <Route exact path="/remember-password" component={RememberPassword} />
                <Route exact path="/reset-password/:randomToken" component={ResetPage} />
                <PrivateRoute exact path='/profiles' component={SelectProfilePage} />
                <PrivateRoute exact path='/organization' component={OrganizationPage} />
                <PrivateRoute exact path='/organization/:id' component={OrganizationDetailPage} />
                <PrivateRoute exact path='/organization/:id/edit' component={EditPage} />
                <PrivateRoute exact path='/organization/:id/trash' component={TrashPage} />
                <PrivateRoute exact path='/organization/:organizationId/users' component={UsersPage} />
                <PrivateRoute exact path='/organization/:organizationId/documentation' component={DocumentationPage} />
                <PrivateRoute exact path='/organization/:organizationId/api' component={ApiPage} />
                <PrivateRoute exact path='/organization/:organizationId/api/new' component={NewApiPage} />
                <PrivateRoute exact path='/organization/:organizationId/api/:apiId/edit' component={EditApiPage} />
                <PrivateRoute exact path='/organization/:organizationId/devices' component={DevicesPage} />
                <PrivateRoute exact path='/organization/:organizationId/devices/new' component={AddDevicePage} />
                <PrivateRoute exact path='/organization/:organizationId/devices/:deviceId/edit' component={EditDevicePage} />
                <PrivateRoute exact path='/organization/:organizationId/gateways' component={GatewaysPage} />
                <PrivateRoute exact path='/project/:id' component={OrganizationDetailPage} />
                <PrivateRoute exact path='/project/:projectId/edit' component={EditPage} />
                <PrivateRoute exact path='/project/:projectId/devices' component={DevicesPage} />
                <PrivateRoute exact path='/project/:projectId/devices/:deviceId/edit' component={EditDevicePage} />
                <PrivateRoute exact path='/project/:projectId/gateways' component={GatewaysPage} />
                <PrivateRoute exact path='/project/:projectId/documentation' component={DocumentationPage} />
                <PrivateRoute exact path='/project/:projectId/shadow-devices' component={ShadowDevicesPage} />
                <PrivateRoute exact path='/project/:projectId/shadow-devices/:shadowDeviceId/edit' component={EditShadowDevicePage} />
                <PrivateRoute exact path='/project/:projectId/users' component={UsersPage} />
                <PrivateRoute exact path='/devices/:deviceId' component={DeviceDetailPage} />
                <PrivateRoute exact path='/gateways/:gatewayId/edit' component={EditGatewayPage} />
                <PrivateRoute exact path='/gateways/:gatewayId' component={GatewayDetailPage} />
                <PrivateRoute exact path='/users/:profileId/edit' component={EditProfile} />
                <PrivateRoute path='/profile' component={UserProfilePage} />
                <Route path='/exception' component={ServerErrorComponent} />
                <Route component={NotFoundComponent} />
            </Switch>
        )
    };
}

const PrivateRoute = ({ component: Component, ...rest }: any) => {
    return (
        <Route {...rest} render={(props) => {
            if (localStorage.getItem(COOKIE_TOKEN))
                return (
                    <Layout style={styles.layout}>
                        <Layout >
                            <LiberiotNavbar {...props} />
                            <Content style={styles.content} >
                                <div className='content-wrapper'>
                                    <Component {...props} />
                                </div>
                            </Content>
                            <LiberiotFooter />
                        </Layout>
                    </Layout>
                )
            return (<Redirect to={{ pathname: "/", state: { from: props.location } }} />)
        }} />
    )
};
const styles = {
    layout: {
        minHeight: '100vh',
    },
    content: {
        background: 'transparent', marginBottom: '1vh'
    }
}

export default withRouter(Router);