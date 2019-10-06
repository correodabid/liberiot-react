import axios from 'axios';
import { action, observable } from "mobx";
import moment, { Moment } from 'moment';
import { orderBy } from "lodash";

import { GatewayStore } from '.';
import Heartbeat from '../models/heartbeat.model';

type LastWeekResponse = {
    _id: {
        hour: number,
        day: number,
        month: number,
        year: number,
    }
    total: number
}
export type LastWeek = { total: number, hour: number, day: string, date: Moment }

export type IHeartbeatsParams = {
    start?: string;
    end?: string;
    gateway: string;
}

export default class HeartbeatStore {
    public GatewayStore: GatewayStore;

    @observable lastWeekHeartbeats: Array<LastWeek> = []
    @observable isLoading: boolean = true;

    constructor(gatewayStore: GatewayStore) {
        this.GatewayStore = gatewayStore;
    }

    @action async getLastWeekHeartbeats(): Promise<void> {
        const { selectedGateway } = this.GatewayStore;
        try {
            this.isLoading = true;

            const res: Array<LastWeekResponse> = (await axios.get(`/heartbeats/last-week`, { params: { gateway: selectedGateway!._id } })).data;

            let parsed = res.map((item: LastWeekResponse) => {
                const { year, hour, day, month } = item._id;
                const date: Moment = moment(`${year}-${month}-${day}T${hour}:00:00.000Z`, 'YYYY-M-DTH:mm:ss:SSSZ')
                return ({
                    total: item.total,
                    hour: date.hour(),
                    day: date.format('ddd'),
                    date
                })
            })
            parsed = orderBy(parsed, (item: LastWeek) => item.date.format('YYYYMMDD'), 'asc');
            this.lastWeekHeartbeats = parsed;
        } catch (error) {
            this.lastWeekHeartbeats = []
        }
        this.isLoading = false;
    }

    async getHeartbeats(params: IHeartbeatsParams): Promise<Array<number>> {
        let activity: Array<number> = new Array(120).fill(0);
        try {
            const data: Array<Heartbeat> = (await axios.get(`/heartbeats`, { params })).data;
            let index = 0;
            let date: Moment = moment(data[0].created_at).startOf("hour")

            activity = activity.map(value => {
                if (data[index] && moment(data[index].created_at).diff(date, 's') < 30) {
                    index++;
                    date.add(30, 's')
                    return 1
                }
                date.add(30, 's')
                return 0
            });
        } catch (error) {
            return Promise.reject(error)
        }
        return activity
    }
}