import { expect } from 'chai';
import { Store } from 'vuex';
import { Wrapper } from '@vue/test-utils';

import HomeType from 'components/pages/home/web/Home';
import UserModule from 'store/modules/user';
import i18n from 'plugins/I18n';

import Home from 'components/pages/home/web/Home.vue';

import Helper from '../../../HelperTestUtils';


describe('components/pages/home/Home.vue', () => {


    let component: Wrapper<HomeType>;
    const store: Store<any> = new Store({
        modules: {
            [UserModule.vuexName]: {
                getters: {},
                mutations: {},
                namespaced: true,
            },
        },
    });

    beforeEach(() => {
        return Helper.initApp<HomeType>({
            component: Home,
            mockStore: store,
        }).then((wrapper) => component = wrapper);
    });


    describe('metaInfo', () => {

        it('initializes page title correctly', () => {
            expect(component.vm.metaInfo().title)
                .to.equal(i18n.t('pages.home.title'));
        });

    });


});
