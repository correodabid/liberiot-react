import axios from 'axios';

// import { logout } from "../api/auth";
import RootStore from '../stores'
import { baseURL, COOKIE_TOKEN } from "./constants";
import { History } from 'history';

axios.defaults.baseURL = baseURL;

export const setHeaderToken = (): void => {
    const token = localStorage.getItem(COOKIE_TOKEN);

    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    else delete axios.defaults.headers.common['Authorization']
}

export default (history: History): void => {
    setHeaderToken();
    axios.interceptors.response.use(
        (result) => result,
        // (result) => result.data,
        (err) => {
            if (err.message.includes('401')) {
                RootStore.AuthStore.logout();
                history.replace({ pathname: '/' })
            }
            return Promise.reject(err);
        })
}