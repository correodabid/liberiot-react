import Organization from "./organization.model";
import Gateway from "./gateway.model";
import Device from "./device.model";
import Measure from "./measure.model";


export default interface Transmission {
    readonly _id: string
    rssi?: string,
    organization?: string | Organization,
    gateway?: string | Gateway,
    device?: string | Device,
    measures?: Array<Measure>,
    readonly created_at: Date
}