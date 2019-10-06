import axios from "axios";
import Profile from '../models/profile.model';

export default class CredentialStore {
    inviteToOrganization(profile: Profile): Promise<Profile> {
        return axios.post(`/credentials/invite`, profile).then(res => res.data)
    }

    resetPassword(values: { password: string, token: string }): Promise<Profile> {
        return axios.post(`/credentials/reset-password`, values).then(res => res.data)
    }

    confirmEmail(credential: any): Promise<Profile> {
        return axios.post(`/credentials/confirm-email`, credential).then(res => res.data)
    }
}