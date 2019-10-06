import React, { Component } from "react";
import { Col, Card, Row, Icon, Avatar } from "antd";
import { Link, RouteComponentProps } from "react-router-dom";
import { DetailCardsData, IDetailCardsData } from '../utils/constants'

interface IProps extends RouteComponentProps {
    title?: string
}

interface IState {
    isProjectPage: boolean
}

export class DetailCards extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isProjectPage: this.props.match.path.includes('/project/')
        }
    }

    render() {
        const { isProjectPage } = this.state;
        const { title, match } = this.props;

        return (
            <Row style={{ textAlign: 'center' }}>
                {
                    DetailCardsData && DetailCardsData.map((obj: IDetailCardsData, index: number) => {
                        if (!obj.project && isProjectPage) {
                            return null
                        }

                        if (!obj.organization && !isProjectPage) {
                            return null
                        }

                        return (
                            <Col key={index} span={8} xs={12} md={8} className='detail-card-link'>
                                <Link to={{ pathname: `${match.url}${obj.route}`, state: { title } }}>
                                    <Card style={{ borderRadius: '1em' }} title={obj.title} >
                                        <p>
                                            <Avatar style={{ backgroundColor: obj.color }} size={75}>
                                                <Icon style={{ fontSize: '2em', verticalAlign: 'middle' }} type={obj.icon} />
                                            </Avatar>
                                        </p>
                                        <p> {obj.description}  </p>
                                    </Card>
                                </Link>
                            </Col>
                        )
                    })
                }
            </Row>
        )
    }
}