import axios from 'axios';
import { action, observable } from "mobx";
import moment, { Moment } from 'moment';
import { orderBy } from "lodash";

import Transmission from '../models/transmission.model';
import { IPaginationProps, ITransmissionParams } from '../models/interfaces';

type LastWeekResponse = {
    _id: {
        hour: number,
        day: number,
        month: number,
        year: number,
    }
    total: number
}
type LastWeekTransmission = { total: number, hour: number, day: string, date: Moment }

type IScaleRange = {
    max: number;
    min: number;
}

export default class TransmissionStore {
    @observable transmissions: IPaginationProps<Transmission> = {
        docs: [], limit: 0, page: 0, pages: 0, total: 0
    }
    @observable lastWeektransmissions: Array<LastWeekTransmission> = []
    @observable isLoading: boolean = true;
    @observable scaleRange: IScaleRange = { max: 0, min: -120 };
    @observable heatMapType: 'rssi' | 'snr' = 'rssi';

    @action async getTransmissions(params: ITransmissionParams): Promise<void> {
        this.transmissions = (await axios.get(`/transmissions`, { params })).data;
    }

    @action async getLastWeekTransmissions(deviceId: string): Promise<void> {
        try {
            this.isLoading = true;
            const params = { device: deviceId, type: this.heatMapType };

            const res: Array<LastWeekResponse> = (await axios.get(`/transmissions/last-week`, { params })).data;
            let parsed = res.map((item: LastWeekResponse) => ({
                total: item.total,
                hour: item._id.hour,
                day: moment([item._id.year, item._id.month - 1, item._id.day]).format('ddd'),
                date: moment([item._id.year, item._id.month - 1, item._id.day, item._id.hour])
            }))
            parsed = orderBy(parsed, (item: LastWeekTransmission) => item.date.format('YYYYMMDD'), 'asc');

            this.scaleRange = this.heatMapType === 'rssi' ? { min: -120, max: 0 } : { min: -9, max: 12 }

            this.lastWeektransmissions = parsed;
        } catch (error) {
            this.lastWeektransmissions = []
        }
        this.isLoading = false;
    }

    @action changeType = (type: 'rssi' | 'snr') => {
        this.heatMapType = type;
    }
}