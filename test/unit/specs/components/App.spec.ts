import { expect } from 'chai';
import { Wrapper } from '@vue/test-utils';

import AppType from 'components/app/web/App';
import store from 'store';

import App from 'components/app/web/App.vue';

import Helper from '../../HelperTestUtils';


describe('components/app/App.vue', () => {


    let component: Wrapper<AppType>;

    beforeEach(() => {
        return Helper.initApp<AppType>({
            component: App,
            mockStore: store,
        }).then((wrapper) => component = wrapper);
    });


    it('mobile mode false by default', () => {
        expect(component.vm.isMobileMode).to.be.false;
    });

    it('left-side menu toggler', () => {
        component.vm.toggleMenu();
        expect(component.vm.isMenuOpen).to.be.true;

        component.vm.toggleMenu();
        expect(component.vm.isMenuOpen).to.be.false;
    });
});
