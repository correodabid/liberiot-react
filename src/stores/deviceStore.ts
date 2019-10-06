import axios from 'axios';
import { observable, action } from 'mobx'
import Device from '../models/device.model';
import { IPaginationProps } from '../models/interfaces';
import Gateway from '../models/gateway.model';
import { socket } from '../utils/socket';
import Organization from '../models/organization.model';

export type IQueryGetDevices = {
    project?: string
    page?: number
    limit?: number
}

export default class DeviceStore {
    @observable devices: IPaginationProps<Device> = { docs: [], page: 0, limit: 0, total: 0, pages: 0 }
    @observable isLoading: boolean = false;
    @observable selectedDevice: Device = {}
    @observable gateways: Array<Gateway> = [];

    @action async getDevices(params?: IQueryGetDevices) {
        this.isLoading = true;
        try {
            const res = await axios.get(`/devices`, { params });
            this.devices = res.data;
            this.isLoading = false;
        }
        catch (e) {
            this.isLoading = false;
            return Promise.reject()
        }
    }

    @action async getDevice(deviceId: string, params?: { populate: boolean }) {
        this.isLoading = true;
        try {
            const res = await axios.get(`/devices/${deviceId}`, { params });
            this.selectedDevice = res.data;
            this.isLoading = false;
        }
        catch (e) {
            this.isLoading = false;
            return Promise.reject()
        }
    }

    @action setDeviceSelected(device: Device) {
        this.selectedDevice = device;
    }

    async editDevice(device: Device) {
        const res = await axios.put(`/devices/${device._id}`, device);
        return res.data;
    }

    async addDevice(device: Device) {
        const res = await axios.post(`/devices`, device);
        return res.data;
    }

    async deleteDevice(deviceId: string) {
        const res = await axios.delete(`/devices/${deviceId}`);
        return res.data;
    }

    @action async getGatewaysAssociated(gatewayId: string): Promise<void> {
        this.isLoading = true;
        try {
            this.gateways = (await axios.get(`/devices/${gatewayId}/gateways`)).data;
        } catch (error) {
            this.gateways = [];
            return Promise.reject()
        }
        this.isLoading = false;
    }

    listenDeviceTransmission = (cb: () => void): void => {
        if (!this.selectedDevice || !this.selectedDevice.organization) return;
        const organization: string = (this.selectedDevice.organization as Organization)._id ? (this.selectedDevice.organization as Organization)._id || '' : this.selectedDevice.organization as string;
        socket.removeAllListeners();
        socket.on(`organization/${organization}/device/${this.selectedDevice._id}/transmission`, () => cb());
    }

    removeSocket(): void {
        socket.removeAllListeners();
    }
}