import { observable, action } from 'mobx'
import axios from "axios";
import Profile from '../models/profile.model';
import { IResponseLogin, IResponseSelectProfile, ISignUpRequest } from '../models/interfaces';
import { setHeaderToken } from '../utils/axiosInterceptor';
import { COOKIE_TOKEN, COOKIE_PROFILE } from '../utils/constants';

export default class AuthStore {
    @observable selectedProfile: Profile = {}
    @observable isUserLoggedIn: boolean = false

    constructor() {
        let user: string | null = localStorage.getItem(COOKIE_PROFILE)
        if (localStorage.getItem(COOKIE_TOKEN)) {
            this.isUserLoggedIn = true;
        }
        if (user) {
            this.selectedProfile = JSON.parse(user)
        }
    }

    signUp(body: ISignUpRequest): Promise<Profile> {
        return axios.post('/credentials', body).then(res => res.data)
    }

    rememberPassword(values: { email: string }): Promise<Profile> {
        return axios.post('/credentials/remember', values).then(res => res.data)
    }


    @action async  login(data: { email: string, password: string }): Promise<Array<Profile>> {
        const result: IResponseLogin = (await axios.post(`/credentials/login`, data)).data;

        if (result.success) {
            if (result.token) {
                localStorage.setItem(COOKIE_TOKEN, result.token);
                this.isUserLoggedIn = true;
                setHeaderToken();
            }
            return result.profiles;
        }
        return Promise.reject();
    }

    @action logout() {
        localStorage.removeItem(COOKIE_TOKEN)
        localStorage.removeItem(COOKIE_PROFILE)
        setHeaderToken();
        this.isUserLoggedIn = false;
        this.selectedProfile = {}
    }

    @action async selectProfile(profileId: string): Promise<Profile> {
        const result: IResponseSelectProfile = (await axios.get(`/credentials/profile/${profileId}`)).data

        if (result.success) {
            localStorage.setItem(COOKIE_TOKEN, result.token);
            localStorage.setItem(COOKIE_PROFILE, JSON.stringify(result.profile));
            this.selectedProfile = result.profile
            setHeaderToken();
            return result.profile;
        }
        return Promise.reject();
    }

    @action updateSelectedProfile(profile: Profile) {
        localStorage.setItem(COOKIE_PROFILE, JSON.stringify(profile));
        this.selectedProfile = profile;
    }


}