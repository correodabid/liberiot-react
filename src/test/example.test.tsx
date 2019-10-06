import React from 'react'
import { findTestAttribute } from './utils'
import { ShallowWrapper, shallow } from 'enzyme';
import { LiberiotNavbar, DevicesTable, TitlePageComponent } from '../components';
import { AuthStore, ProjectStore, OrganizationStore } from '../stores';
import { CardComponent } from '../components/DashboardCard/CardComponent';
import LoginPage from '../pages/Login';
import UserAvatar from '../components/UserAvatar';
import { TransmissionsTable } from '../components/TransmissionsTable';


describe('Renders the components without errors or crashing', () => {

    it('Renders the navbar component correctly', () => {
        const store: AuthStore = new AuthStore()
        const props: any = { location: { pathname: '/dashboard' }, history: {}, match: {} }
        const wrapper: ShallowWrapper = shallow(<LiberiotNavbar AuthStore={store} {...props} />).dive();
        const navbar: ShallowWrapper = findTestAttribute(wrapper, 'className', 'navbar')
        expect(navbar).toHaveLength(1)
    })

    it('Should not render the devices table if no devices are passed', () => {
        const wrapper: ShallowWrapper = shallow(<DevicesTable devices={[]} />)
        const component: ShallowWrapper = findTestAttribute(wrapper, 'data-test', 'devicesTable')
        expect(component).toHaveLength(0)
    })

    it('Should render the devices table correctly if devices array is passed', () => {
        const wrapper: ShallowWrapper = shallow(<DevicesTable devices={[{}, {}, {}]} />)
        const component: ShallowWrapper = findTestAttribute(wrapper, 'data-test', 'devicesTable')
        expect(component).toHaveLength(1)
    })

    it('Should not render the transmissions table if no transmissions are passed', () => {
        const wrapper: ShallowWrapper = shallow(<TransmissionsTable transmissions={{ docs: [], page: 0, pages: 0, limit: 0, total: 0 }} />)
        const component: ShallowWrapper = findTestAttribute(wrapper, 'data-test', 'transmissionsTable')
        expect(component).toHaveLength(0)
    })

    it('Should render the transmissions table correctly if transmissions array is passed', () => {
        const wrapper: ShallowWrapper = shallow(<TransmissionsTable transmissions={{ docs: [{ _id: '1', created_at: new Date() }], page: 1, pages: 1, limit: 10, total: 3 }} />)
        const component: ShallowWrapper = findTestAttribute(wrapper, 'data-test', 'transmissionsTable')
        expect(component).toHaveLength(1)
    })

    it('Should render the TitlePage component with no back arrow if no history', () => {
        const props: any = { title: 'titu', description: 'desc' }
        const wrapper: ShallowWrapper = shallow(<TitlePageComponent {...props} />)
        const component: ShallowWrapper = findTestAttribute(wrapper, 'data-test', 'noBackButton')
        expect(component).toHaveLength(1)
    })

    it('Should render the TitlePage component with back arrow if history', () => {
        const props: any = { history: {} }
        const wrapper: ShallowWrapper = shallow(<TitlePageComponent {...props} />)
        const component: ShallowWrapper = findTestAttribute(wrapper, 'data-test', 'backButton')
        expect(component).toHaveLength(1)
    })

})

describe('Rendering Card component', () => {

    it('Does not render the card component without type passed', () => {
        const store: ProjectStore = new ProjectStore()
        const orgStore: OrganizationStore = new OrganizationStore(store);
        const wrapper: ShallowWrapper = shallow(<CardComponent ProjectStore={store} OrganizationStore={orgStore} type="" />).dive();
        const component: ShallowWrapper = findTestAttribute(wrapper, 'data-test', 'card')
        expect(component).toHaveLength(0)
    })

    it('Renders the card component correctly when a type is passed', () => {
        const store: ProjectStore = new ProjectStore()
        const orgStore: OrganizationStore = new OrganizationStore(store);
        const wrapper: ShallowWrapper = shallow(<CardComponent ProjectStore={store} OrganizationStore={orgStore} type="project" />).dive();
        const component: ShallowWrapper = findTestAttribute(wrapper, 'data-test', 'card')
        expect(component).toHaveLength(1)
    })

})

describe('LOGIN component', () => {

    it('Should render component', () => {
        const props: any = {}
        const store: AuthStore = new AuthStore()
        const wrapper: ShallowWrapper = shallow(<LoginPage AuthStore={store} {...props} />).dive()
        const component: ShallowWrapper = findTestAttribute(wrapper, 'id', 'login')
        expect(component).toHaveLength(1)
    })

})

describe('USER AVATAR component', () => {

    const setUp = (props: any = {}) => {
        const sw: ShallowWrapper = shallow(<UserAvatar  {...props} />)
        return sw
    }

    it('Should not render component if theres no user', () => {
        const wrapper = setUp()
        const component: ShallowWrapper = findTestAttribute(wrapper, 'data-test', 'avatar')
        expect(component).toHaveLength(0)
    })

    it('Should render component if theres user', () => {
        const wrapper = setUp({ user: {} })
        const component: ShallowWrapper = findTestAttribute(wrapper, 'data-test', 'avatar')
        expect(component).toHaveLength(1)
    })

    it('Should render component if theres user and tooltip', () => {
        const wrapper = setUp({ user: {}, showTooltip: true })
        const component: ShallowWrapper = findTestAttribute(wrapper, 'data-test', 'avatar-tooltip')
        expect(component).toHaveLength(1)
    })

})