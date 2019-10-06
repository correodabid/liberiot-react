import Organization from "./organization.model";

interface ICredential extends Document {
    _id?: string;
    password?: string;
    created_at?: Date;
}

export default interface Profile {
    _id?: string
    email?: string,
    is_admin?: boolean,
    is_owner?: boolean,
    first_name?: string,
    last_name?: string,
    credential?: string | ICredential,
    organization?: Organization,
    created_at?: Date;
    UserProjectId?: string;
}