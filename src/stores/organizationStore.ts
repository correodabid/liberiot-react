import { observable, action } from 'mobx'
import axios from 'axios';
import Organization from '../models/organization.model';
import { IPaginationProps } from '../models/interfaces';
import ProjectStore from './projectStore';

export default class OrganizationStore {
    @observable organizations: IPaginationProps<Organization> = { docs: [], limit: 0, page: 0, total: 0, pages: 0 };
    @observable selectedOrganization?: Organization = {};
    @observable isLoading: boolean = false;
    public ProjectStore: ProjectStore;

    constructor(projectStore: ProjectStore) {
        this.ProjectStore = projectStore;
    }

    @action async getOrganizations() {
        this.isLoading = true
        try {
            const res = await axios.get(`/organizations`);
            this.organizations = res.data;
            this.isLoading = false;
        }
        catch (e) {
            this.isLoading = false;
            return Promise.reject();
        }
    }

    @action async getOrganization(organizationId: string) {
        this.isLoading = true
        try {
            const res = await axios.get(`/organizations/${organizationId}`);
            await this.ProjectStore.getProjects({ active: true, members: true })
            this.selectedOrganization = res.data;
            this.ProjectStore.selectedProject = undefined
            this.isLoading = false;
        }
        catch (e) {
            this.isLoading = false;
            return Promise.reject();
        }
    }

    @action setOrganizationSelected(organization: Organization) {
        this.selectedOrganization = organization;
    }

    async editOrganization(organization: Organization): Promise<Organization> {
        const res = await axios.put(`/organizations/${organization._id}`, organization);
        return res.data;
    }
}
