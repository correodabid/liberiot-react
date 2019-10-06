import Organization from "./organization.model";

export default interface Key {
    readonly _id?: string,
    name?: string,
    organization?: Organization,
    uuid?: string,
    readonly created_at?: Date
}