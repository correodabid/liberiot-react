import React, { Component } from "react";
import { Icon, Avatar } from "antd";
import { RouteComponentProps } from "react-router";
import { DetailCardsData, IDetailCardsData } from "../utils/constants";

interface ILocationState {
    title: string;
}
interface IProps extends RouteComponentProps<any, any, ILocationState> {

}

interface IState {
    menuVisible: boolean,
    parentRoute: string
}

export class LiberiotBreadcrumbs extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        const pathSplip: Array<string> = props.location.pathname.split('/')

        this.state = {
            menuVisible: false,
            parentRoute: `/${pathSplip[1]}/${pathSplip[2]}`
        }
    }

    handleNavigation = (route: string) => {
        const { parentRoute } = this.state;
        const { history, location } = this.props;

        if (route.trim() && !location.pathname.includes(route)) {
            history.replace(`${parentRoute}${route}`, location.state)
        }
    }

    checkCurrentRoute = (route: string): string => {
        const { location } = this.props;

        if (route.trim() && location.pathname.includes(route)) {
            return 'inherit'
        }
        return 'pointer'
    }

    render() {
        const { location, history } = this.props;
        const { menuVisible, parentRoute } = this.state;

        const isProjectPage: boolean = this.props.match.path.includes('/project/');

        return (
            <div style={{ position: 'relative', textAlign: 'center' }} className="breadcrumbs">
                <h1>
                    <Icon type="appstore" theme={menuVisible ? 'filled' : 'outlined'} style={{ color: '#D3D3D3' }}
                        onClick={() => this.setState({ menuVisible: !menuVisible })} />
                    <button className='link' onClick={() => {
                        history.goBack();
                        history.replace(parentRoute)
                    }}> {location.state && location.state.title}</button>
                    {
                        menuVisible &&
                        <span className="menu">
                            {DetailCardsData.map((detailCard: IDetailCardsData, index: number) => {
                                if (!detailCard.project && isProjectPage) {
                                    return null;
                                }

                                if (!detailCard.organization && !isProjectPage) {
                                    return null;
                                }

                                return (
                                    <span className="action" key={index.toString()}
                                        onClick={() => this.handleNavigation(detailCard.route)}
                                        style={{ cursor: this.checkCurrentRoute(detailCard.route) }}>
                                        <div className="title">{detailCard.title}</div>
                                        <Avatar className="icon"
                                            style={{ backgroundColor: detailCard.color }} >
                                            <Icon style={{ fontSize: '1.2rem' }} type={detailCard.icon} />
                                        </Avatar>
                                    </span>
                                )
                            })}
                        </span>
                    }
                </h1>
            </div>
        )
    }
}