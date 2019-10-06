import Profile from './profile.model'
import Organization from './organization.model'

export default interface Project {
    readonly _id?: string
    name?: string
    uuid?: string
    members?: Array<Profile>
    organization?: string | Organization
    active?: boolean
    readonly created_at?: Date
}