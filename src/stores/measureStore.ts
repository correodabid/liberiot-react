import axios from 'axios'
import { observable, action } from 'mobx'

import { IPaginationProps, IQueryOptions } from '../models/interfaces';
import Measure from '../models/measure.model';

export interface IMeasuresParams extends IQueryOptions {
    device?: string;
    endpoint?: string;
    transmission?: string;
    gateway?: string;
    populate?: string;
}

export default class MeasureStore {
    @observable measures: IPaginationProps<Measure> = { docs: [], page: 0, limit: 0, total: 0, pages: 0 }
    @observable isLoading: boolean = false

    @action async getMeasures(params?: IMeasuresParams) {
        this.isLoading = true
        try {
            const res = await axios.get(`/measures`, { params });
            this.measures = res.data;
            this.isLoading = false;
        }
        catch (e) {
            this.isLoading = false;
            return Promise.reject()
        }
    }

}
