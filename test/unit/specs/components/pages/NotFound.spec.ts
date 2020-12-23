import { expect } from 'chai';
import { Store } from 'vuex';
import { Wrapper } from '@vue/test-utils';

import NotFoundType from 'components/pages/not-found/NotFound';
import UserModule from 'store/modules/user';
import i18n from 'plugins/I18n';

import NotFound from 'components/pages/not-found/NotFound.vue';

import Helper from '../../../HelperTestUtils';


describe('components/pages/not-found/NotFound.vue', () => {


    let component: Wrapper<NotFoundType>;
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
        return Helper.initApp<NotFoundType>({
            component: NotFound,
            mockStore: store,
        }).then((wrapper) => component = wrapper);
    });


    describe('metaInfo', () => {

        it('initializes page title correctly', () => {
            expect(component.vm.metaInfo().title)
                .to.equal(i18n.t('pages.not-found.title'));
        });

    });


});
