import Profile from "./profile.model";

export type IResponseLogin = {
    success: boolean,
    two_factor: boolean,
    profiles: Array<Profile>,
    token?: string
}

export type IResponseSelectProfile = {
    success: boolean,
    profile: Profile,
    token: string
}

export type ISignUpRequest = {
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    repeat_password: string,
    organization: string,
    is_admin: boolean,
    is_owner: boolean
}

export type IDataForm = {
    email: string,
    password: string
}

export interface IQueryOptions {
    limit?: number;
    page?: number;
}

export interface IPaginationProps<Model=any> {
    docs: Array<Model>;
    page: number;
    pages: number;
    limit: number;
    total: number;
}

export interface ITransmissionParams extends IQueryOptions {
    sort?: string;
    select?: string;
    start?: string
    end?: string;
    device?: string;
    gateway?: string;
    populate?: string;
}