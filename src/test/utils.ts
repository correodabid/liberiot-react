import { ShallowWrapper } from 'enzyme'

//Pass a component and find inside the searched attribute
export const findTestAttribute = (component: ShallowWrapper, key: string, attribute: string) => {
    const wrapper: ShallowWrapper = component.find(`[${key}='${attribute}']`)
    return wrapper;
}