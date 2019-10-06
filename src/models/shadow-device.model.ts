import Organization from './organization.model';
import Project from './project.model';

export default interface ShadowDevice {
    readonly _id?: string;
    name?: string;
    uuid?: string;
    organization?: string | Organization;
    project?: string | Project;
    active?: boolean;
    samples?: Array<{readonly _id?: string, type?: 'number' | 'string' | 'boolean', name?: string }>
    readonly created_at?: Date;
}