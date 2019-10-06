import axios from 'axios';
import { observable, action } from 'mobx';
import Project from '../models/project.model';
import { UserProject } from '../models/userProject.model';
import { IPaginationProps } from '../models/interfaces';
import Profile from '../models/profile.model';

export default class ProjectStore {
    @observable projects: Array<Project> = [];
    @observable selectedProject?: Project;
    @observable isLoading: boolean = false;
    @observable projectMembers?: IPaginationProps<UserProject>;

    @action async getProjects(params: { active: boolean, members?: boolean }) {
        try {
            this.isLoading = true;
            this.projects = (await axios.get(`/projects`, { params })).data;
            this.isLoading = false;
        } catch (error) {
            this.isLoading = false;
        }
    }

    @action async getProject(id: string) {
        try {
            this.isLoading = true;
            this.selectedProject = (await axios.get(`/projects/${id}`)).data;
            this.isLoading = false;
        } catch (error) {
            this.isLoading = false;
        }
    }

    async addProject(project: Project) {
        await axios.post(`/projects`, project)
    }

    async editProject(project: Project) {
        await axios.put(`/projects/${project._id}`, project)
    }

    async deleteProject(id: string) {
        await axios.delete(`/projects/${id}`)
    }

    @action async getMembers(projectId?: string, params?: { search?: string, limit?: number, page?: number }): Promise<void> {
        this.isLoading = true;
        try {
            this.projectMembers = (await axios.get(`/projects/${projectId}/members`, { params })).data;
        } catch (error) {
            this.projectMembers = { docs: [], page: 0, limit: 0, total: 0, pages: 0 }
        }
        this.isLoading = false;
    }

    async addMember(user: Profile, projectId?: string): Promise<void> {
        await axios.post(`/projects/${projectId}/members`, user)
    }

    async deleteMember(projectId?: string, userProjectId?: string): Promise<void> {
        await axios.delete(`/projects/${projectId}/members/${userProjectId}`);
    }
}
