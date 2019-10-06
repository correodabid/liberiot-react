import Organization from "./organization.model";
import Transmission from "./transmission.model";
import Device from "./device.model";
import Gateway from "./gateway.model";

export default interface Measure {
    readonly _id: string
    endpoint?: string,
    value?: number,
    transmission?: Transmission,
    device?: Device,
    gateway?: Gateway,
    organization?: string | Organization,
    readonly created_at: Date
}