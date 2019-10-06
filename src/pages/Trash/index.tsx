import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { TitlePageComponent } from "../../components";
import { Card, Empty, message, Table } from "antd";
import Project from "../../models/project.model";
import { ProjectStore } from "../../stores";
import { inject, observer } from "mobx-react";
import { ColumnProps } from "antd/lib/table";

interface IProps extends RouteComponentProps<{ id: string }> {
    ProjectStore: ProjectStore

}

@inject('ProjectStore') @observer
export default class TrashPage extends Component<IProps> {

    componentDidMount() {
        this.fetchProjects()
    }

    fetchProjects = async () => {
        await this.props.ProjectStore.getProjects({ active: false })
    }

    undoDelete = async (project: Project) => {
        await this.props.ProjectStore.editProject({ ...project, active: true })
        message.success('Your project is now active again');
        this.fetchProjects();
    }

    render() {
        const { projects } = this.props.ProjectStore;
        const columns: Array<ColumnProps<Project>> = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: 'Recover',
            dataIndex: 'recover',
            key: 'recover',
            render: (text: string, record: Project) => (
                <button className='link' onClick={() => this.undoDelete(record)} > Put Back</button>
            )
        }]

        return (
            <Card>
                <span className='hide-on-mobile'>
                    <TitlePageComponent title="Trash" description="Here are your deleted projects" history={this.props.history} />
                </span>
                <span className='hide-on-desktop'>
                    <TitlePageComponent title="Trash" description="Here are your deleted projects" />
                </span>
                {projects && projects.length > 0 ?
                    <Table rowKey="_id" pagination={{ size: 'small' }} columns={columns} dataSource={projects} />
                    // projects.map((project: Project, index: number) =>
                    //     <Col key={index} span={7} offset={1}>
                    //         {project._id &&
                    //             <Card style={{ margin: '2em', width: 200, height: 130, borderRadius: 10 }} >
                    //                 <p style={{ textAlign: 'left', fontSize: '1.2em' }}><b>{project.name}</b></p>
                    //                 {project.members && project.members.map((user: Profile, index: number) =>
                    //                     <UserAvatar showTooltip={true} key={index} user={user} size={24} fontSize={"1em"} />
                    //                 )}
                    //                 <footer style={{ position: 'absolute', right: 0, bottom: 0, left: 0, padding: '.5em', textAlign: 'center' }}>
                    //                     <a onClick={() => this.undoDelete(project)} > Put Back</a>
                    //                 </footer>
                    //             </Card>
                    //         }
                    //     </Col>
                    // )
                    : <Empty />
                }
            </Card>
        )
    }
}