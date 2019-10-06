import Project from "./project.model";
import Organization from "./organization.model";

export default interface Gateway {
    _id?: string
    name?: string,
    location?: { type: string, coordinates: Array<number> },
    address?: string,
    mac?:string,
    uuid?: string,
    is_on?: boolean,
    since?: Date,
    is_production?: boolean,
    is_enabled?: boolean,
    last_connection?: Date,
    organization?: Organization;
    project?: Project,
    created_at?: Date
}