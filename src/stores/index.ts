import AuthStore from './authStore'
import CredentialStore from './credentialStore'
import DeviceStore from './deviceStore'
import GatewayStore from './gatewayStore'
import KeyStore from './keyStore'
import OrganizationStore from './organizationStore'
import ProfileStore from './profileStore'
import ProjectStore from './projectStore'
import ShadowDeviceStore from './shadowDeviceStore'
import TransmissionStore from './transmissionStore'
import MeasureStore from "./measureStore";
import HeartbeatStore from "./heartbeatStore";

export class RootStore {
    public AuthStore: AuthStore;
    public CredentialStore: CredentialStore;
    public DeviceStore: DeviceStore;
    public GatewayStore: GatewayStore;
    public KeyStore: KeyStore;
    public ProjectStore: ProjectStore;
    public OrganizationStore: OrganizationStore;
    public ProfileStore: ProfileStore;
    public ShadowDeviceStore: ShadowDeviceStore;
    public TransmissionStore: TransmissionStore;
    public MeasureStore: MeasureStore;
    public HeartbeatStore: HeartbeatStore;

    constructor() {
        this.AuthStore = new AuthStore();
        this.CredentialStore = new CredentialStore();
        this.DeviceStore = new DeviceStore();
        this.GatewayStore = new GatewayStore();
        this.KeyStore = new KeyStore();
        this.ProjectStore = new ProjectStore();
        this.OrganizationStore = new OrganizationStore(this.ProjectStore);
        this.ProfileStore = new ProfileStore(this.OrganizationStore);
        this.ShadowDeviceStore = new ShadowDeviceStore();
        this.TransmissionStore = new TransmissionStore();
        this.MeasureStore = new MeasureStore();
        this.HeartbeatStore = new HeartbeatStore(this.GatewayStore);
    }
}

export default new RootStore();

export {
    AuthStore,
    CredentialStore,
    DeviceStore,
    GatewayStore,
    KeyStore,
    OrganizationStore,
    ProfileStore,
    ProjectStore,
    ShadowDeviceStore,
    TransmissionStore,
    MeasureStore,
    HeartbeatStore
}