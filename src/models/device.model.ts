import Organization from './organization.model';
import Project from './project.model';
import Gateway from './gateway.model';

export default interface Device {
    _id?: string,
    name?: string,
    uuid?: string,
    mac?: string,
    location?: {
        type: string,
        coordinates: Array<number>
    },
    address?: string,
    nearest_gateway?: Gateway,
    is_production?: boolean,
    is_enabled?: boolean,
    organization?: string | Organization,
    project?: string | Project,
    last_connection?: Date,
    periodicity?: number,
    battery?: number,
    created_at?: Date
}