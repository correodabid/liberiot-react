import axios from 'axios'
import { observable, action } from 'mobx'
import Profile from "../models/profile.model";
import { IPaginationProps } from '../models/interfaces';
import OrganizationStore from './organizationStore';

export default class ProfileStore {
    @observable profiles: Array<Profile> = []
    @observable users: IPaginationProps<Profile> = { docs: [], limit: 0, page: 0, total: 0, pages: 0 }
    @observable selectedProfile: Profile = {}
    @observable isLoading: boolean = false;

    public OrganizationStore: OrganizationStore;

    constructor(organizarionStore: OrganizationStore) {
        this.OrganizationStore = organizarionStore;
    }

    @action async getUsers(options?: { page?: number, limit?: number, search?: string }) {
        this.isLoading = true;
        try {
            const res = await axios.get(`/profiles`, { params: { ...options, organization: this.OrganizationStore.selectedOrganization!._id } });
            this.users = res.data;
            this.isLoading = false;
        }
        catch (e) {
            return this.isLoading = false;
        }
    }

    @action async getUser(profileId: string) {
        this.isLoading = true;
        try {
            const res = await axios.get(`/profiles/${profileId}`);
            this.selectedProfile = res.data;
            this.isLoading = false;
        }
        catch (e) {
            return this.isLoading = false;
        }
    }

    @action async getProfilesByCredential() {
        this.isLoading = true;
        try {
            const res = await axios.get(`/profiles/credential`);
            this.profiles = res.data;
            this.isLoading = false;
        }
        catch (e) {
            return this.isLoading = false;
        }
    }

    async editProfile(profile: Profile) {
        const res = await axios.put(`/profiles/${profile._id}`, profile);
        return res.data;
    }

    async deleteProfile(profileId: string) {
        const res = await axios.delete(`/profiles/${profileId}`);
        return res.data;
    }

    async getProfilesByEmail(options: { email: string }): Promise<Array<Profile>> {
        const result: IPaginationProps<Profile> = (await axios.get(`/profiles`, { params: { ...options, organization: this.OrganizationStore.selectedOrganization!._id } })).data;
        return result.docs;
    }
}
