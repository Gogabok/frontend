import { expect } from 'chai';

import Validation from 'plugins/Validation';
import store from 'store';
import AppType from 'components/app/web/App';

import App from 'components/app/web/App.vue';

import Helper from '../../HelperTestUtils';


describe('Validation.ts', () => {


    describe('init()', () => {

        it('initializes vee-validate plugin correctly', (done: Mocha.Done) => {
            Validation.init();
            Helper.initApp<AppType>({
                component: App,
                mockStore: store,
            }).then((wrapper) => {
                expect(wrapper.vm.$options.components)
                    .to.have.property('ValidationObserver');
                expect(wrapper.vm.$options.components)
                    .to.have.property('ValidationProvider');
                done();
            });
        });

    });


});
