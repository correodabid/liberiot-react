import axios from 'axios'
import Key from '../models/key.model';
import { observable, action } from 'mobx'
import { IPaginationProps } from '../models/interfaces';

export default class KeyStore {
    @observable keys: IPaginationProps<Key> = { docs: [], page: 0, limit: 0, total: 0, pages: 0 }
    @observable selectedKey?: Key
    @observable isLoading: boolean = false


    constructor() {
        this.selectedKey = undefined
    }

    @action async getKeys(params?: { page?: number, limit?: number, populate?: string }) {
        this.isLoading = true
        try {
            const res = await axios.get(`/keys`, { params });
            this.keys = res.data;
            this.isLoading = false;
        }
        catch (e) {
            this.isLoading = false;
            return Promise.reject()
        }
    }

    @action async  getKey(keyId: string) {
        this.isLoading = true
        try {
            const res = await axios.get(`/keys/${keyId}`);
            this.selectedKey = res.data;
            this.isLoading = false;
        }
        catch (e) {
            this.isLoading = false;
            return Promise.reject()
        }
    }

    async addKey(key: Key) {
        const res = await axios.post(`/keys`, key);
        return res.data;
    }

    async editKey(key: Key) {
        const res = await axios.put(`/keys/${key._id}`, key);
        return res.data;
    }

    async deleteKey(keyId: string) {
        const res = await axios.delete(`/keys/${keyId}`);
        return res.data;
    }
}
