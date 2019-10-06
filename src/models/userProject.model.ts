import Organization from "./organization.model";
import Project from "./project.model";
import Profile from "./profile.model";

export interface UserProject {
    readonly _id?: string;
    organization?: string | Organization;
    project?: string | Project;
    profile: Profile;
    readonly created_at?: Date
}