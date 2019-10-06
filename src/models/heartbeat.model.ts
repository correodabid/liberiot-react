import Gateway from "./gateway.model";

export default interface Heartbeat {
    readonly _id?: string,
    gateway?: Gateway,
    readonly created_at?: Date
}