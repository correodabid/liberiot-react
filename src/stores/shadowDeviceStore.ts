import axios, { AxiosResponse } from 'axios';
import { action, observable } from "mobx";
import ShadowDevice from '../models/shadow-device.model';

export type IQueryGetShadowDevices = {
    project?: string
}

export default class ShadowDeviceStore {
    @observable shadowDevices: Array<ShadowDevice> = [];
    @observable selectedShadowDevice?: ShadowDevice;
    @observable isLoading: boolean = false;
    @observable isModalVisible: boolean = false;

    @action async getShadowDevices(params?: IQueryGetShadowDevices): Promise<void> {
        try {
            this.isLoading = true;
            this.shadowDevices = (await axios.get(`/shadow-devices`, { params })).data;
            this.isLoading = false;
        } catch (error) {
            this.shadowDevices = []
            this.isLoading = false;
            return Promise.reject();
        }
    }

    @action async getShadowDevice(shadowDeviceId: string): Promise<void> {
        try {
            this.isLoading = true;
            this.selectedShadowDevice = (await axios.get(`/shadow-devices/${shadowDeviceId}`)).data;
            this.isLoading = false;
        } catch (error) {
            this.selectedShadowDevice = undefined;
            this.isLoading = false;
            return Promise.reject();
        }
    }

    async addShadowDevice(shadowDevice: ShadowDevice): Promise<void> {
        await axios.post(`/shadow-devices`, shadowDevice);
    }

    @action async editShadowDevice(shadowDevice: ShadowDevice): Promise<void> {
        try {
            this.isLoading = true;
            this.selectedShadowDevice = (await axios.put(`/shadow-devices/${shadowDevice._id}`, shadowDevice)).data;
            this.isLoading = false;
        } catch (error) {
            this.selectedShadowDevice = undefined;
            this.isLoading = false;
            return Promise.reject();
        }
    }

    async deleteShadowDevice(shadowDeviceId: string): Promise<void> {
        await axios.delete(`/shadow-devices/${shadowDeviceId}`);
    }

    async tryShadowDevice(shadowDeviceId: string): Promise<boolean> {
        const res: AxiosResponse<boolean> = await axios.get(`/shadow-devices/${shadowDeviceId}/try`);
        return res.data
    }

    @action changeIsModalVisible() {
        this.isModalVisible = !this.isModalVisible;
    }
}
