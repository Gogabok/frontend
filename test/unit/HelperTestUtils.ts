import Vue from 'vue';
import { Store } from 'vuex';
import { mount, MountOptions, shallowMount, Wrapper } from '@vue/test-utils';

import Vuebar from 'vuebar';
import I18n from 'plugins/I18n';
import Router from 'Router';
import Touch from 'plugins/Touch';
import Validation from 'plugins/Validation';
import Clipboard from 'plugins/Clipboard';


/**
 * Describes options for initApp method.
 */
export interface InitAppOptions {

    /**
     * Vue component that will be mounted and rendered at the app root level.
     */
    component: any;

    /**
     * Vuex store instance with mocked actions, that will be used
     * during the test.
     */
    mockStore: Store<any>;

    /**
     * Optional. Specifies component props.
     */
    props?: any;

    /**
     * Optional. Specifies locale, which will be used during rendering.
     * Default - en.
     */
    locale?: string;

    /**
     * Objects with stub for this component.
     */
    customStubs?: any;

    /**
     * Object with mocks for this component.
     */
    mocks? : any;

    /**
     * Custom directives, that must be registered with this component.
     */
    directives?: any;

    /**
     * Custom filters, that must be registered with this component.
     */
    filters?: any;

    /**
     * If true component app will be created and mounted
     * by shallowMount function.
     */
    isShallow?: boolean;

    /**
     * Local vue instance.
     */
    localVue?: any;
}

/**
 * Helper class with common functions, required fot unit specs.
 */
export default class Helper {

    /**
     * Creates Wrapper with Vue application instance with rendered given
     * component and locale.
     *
     * @param options   Object with init app options.
     *
     * @return    Resolved promise with vue-test-utils wrapper object of
     *            T (generic) type.
     */
    public static async initApp<T extends Vue>(
        options: InitAppOptions,
    ): Promise<Wrapper<T>> {
        const {
            component,
            mockStore,
            props = {},
            locale = 'en',
            customStubs,
            mocks,
            directives,
            filters,
            isShallow = false,
            localVue,
        }: InitAppOptions = options;

        const mountOptions: MountOptions<any> = {
            directives: { ...directives, 'bar': Vuebar },
            filters: { ...filters },
            i18n: await I18n.init([locale]),
            localVue,
            mocks,
            propsData: props,
            router: new Router({ ssrMode: true }).instance,
            store: mockStore,
            stubs: { ...customStubs },
        };

        await Validation.init();
        Touch.init();
        Clipboard.init();

        return isShallow
            ? shallowMount(component, mountOptions)
            : mount(component, mountOptions);
    }

}
