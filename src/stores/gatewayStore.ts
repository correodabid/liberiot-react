import { observable, action } from 'mobx'
import axios from 'axios';
import { IPaginationProps } from '../models/interfaces';
import Gateway from '../models/gateway.model';
import Device from '../models/device.model';
import { socket } from '../utils/socket';
import Organization from '../models/organization.model';

export type IQueryGetGateways = {
    project?: string
    populate?: string
    is_production?: boolean
}

export default class GatewayStore {
    @observable gateways: IPaginationProps<Gateway> = { docs: [], page: 0, limit: 0, total: 0, pages: 0 }
    @observable isLoading: boolean = false
    @observable selectedGateway?: Gateway = {}
    @observable devices: Array<Device> = []

    constructor() {
        this.selectedGateway = undefined
    }

    @action getGateways(params?: IQueryGetGateways) {
        this.isLoading = true
        return axios.get(`/gateways`, { params })
            .then(res => {
                this.gateways = res.data;
                this.isLoading = false
            }).catch(() => {
                this.isLoading = false
            })
    }

    @action getGateway(gatewayId: string) {
        this.isLoading = true
        return axios.get(`/gateways/${gatewayId}`)
            .then(res => {
                this.selectedGateway = res.data;
                this.isLoading = false
            }).catch(() => {
                this.isLoading = false
            })
    }

    @action setGatewaySelected(gateway: Gateway) {
        this.selectedGateway = gateway;
    }

    async editGateway(gateway: Gateway) {
        const res = await axios.put(`/gateways/${gateway._id}`, gateway);
        return res.data;
    }

    async addGateway(gateway: Gateway): Promise<Gateway> {
        const res = await axios.post(`/gateways`, gateway);
        return res.data;
    }

    async deleteGateway(id: string): Promise<void> {
        const res = await axios.delete(`/gateways/${id}`);
        return res.data;
    }

    @action async getDevicesAssociated(gatewayId: string): Promise<void> {
        this.isLoading = true;
        try {
            this.devices = (await axios.get(`/gateways/${gatewayId}/devices`)).data;
        } catch (error) {
            this.devices = [];
            return Promise.reject()
        }
        this.isLoading = false;
    }

    listenGatewayHeartbeat = (cb: () => void): void => {
        if (!this.selectedGateway) return;
        const organization: string = (this.selectedGateway.organization as Organization)._id ? (this.selectedGateway.organization as Organization)._id || '' : this.selectedGateway.organization as string;

        socket.removeAllListeners();
        socket.on(`organization/${organization}/gateway/${this.selectedGateway._id}/heartbeat`, () => cb());
    }

    removeSocket(): void {
        socket.removeAllListeners();
    }
}
