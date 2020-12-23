import { expect } from 'chai';
import { Store } from 'vuex';
import { Wrapper } from '@vue/test-utils';

import BottomMenuType from 'components/common/menu/bottom-menu/BottomMenu';
import { IS_LANG_SIDEBAR_ACTIVE } from 'store/root/getters';
import { SET_LANG_SIDEBAR_ACTIVE } from 'store/root/mutations';

import BottomMenu from 'components/common/menu/bottom-menu/BottomMenu.vue';

import Helper from '../../HelperTestUtils';


describe('components/common/menu/bottom-menu/BottomMenu.vue', () => {


    let component: Wrapper<BottomMenuType>;
    let store: Store<any>;

    beforeEach(() => {
        store = new Store({
            getters: {
                [IS_LANG_SIDEBAR_ACTIVE]: (state) => state.langSideBarActive,
            },
            mutations: {
                [SET_LANG_SIDEBAR_ACTIVE]: (state, payload) => {
                    state.langSideBarActive = payload;
                },
            },
            state: {
                langSideBarActive: false,
            },
        });

        return Helper.initApp<BottomMenuType>({
            component: BottomMenu,
            mockStore: store,
        }).then((wrapper) => component = wrapper);
    });


    describe('active menu prop', () => {

        it('active menu prop false by default', () => {
            expect(component.vm.isMenuOpen).to.be.false;
        });
    });
});
