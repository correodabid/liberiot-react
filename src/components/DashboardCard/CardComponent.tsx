import React, { Component } from "react";
import { Col, Row } from "antd";
import { BasicCardComponent } from './BasicCardComponent'
import Slider from "react-slick";
import { slideSettings } from '../../utils/constants'
import Project from "../../models/project.model";
import { inject, observer } from "mobx-react";
import { ProjectStore, OrganizationStore } from "../../stores";

interface IProps {
    type: string
    ProjectStore?: ProjectStore
    OrganizationStore?: OrganizationStore
}

interface IState {

}
@inject('ProjectStore', 'OrganizationStore') @observer
export class CardComponent extends Component<IProps, IState> {

    render() {
        const { type } = this.props;
        const { projects } = this.props.ProjectStore!
        const { selectedOrganization } = this.props.OrganizationStore!


        if (!type) return null

        return (
            <Row data-test="card" style={{ paddingRight: '1vw', paddingLeft: '1vw' }}>
                <Slider {...slideSettings}>
                    {
                        type === 'project' && projects ? projects.map((project: Project, index: number) =>
                            <Col key={index} >
                                {project._id && <BasicCardComponent name={project.name} id={project._id} type={type} members={project.members} />}
                            </Col>
                        )
                            : selectedOrganization!._id && <BasicCardComponent name={selectedOrganization!.name} id={selectedOrganization!._id} type={type} />
                    }
                </Slider>
            </Row>
        )
    }
}