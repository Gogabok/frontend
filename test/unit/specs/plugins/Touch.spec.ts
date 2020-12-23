import { expect } from 'chai';

import store from 'store';
import AppType from 'components/app/web/App';

import App from 'components/app/web/App.vue';

import Helper from '../../HelperTestUtils';


describe('Touch.ts', () => {


    describe('init()', () => {

        it('initializes touch plugin correctly', (done: Mocha.Done) => {
            Helper.initApp<AppType>({
                component: App,
                mockStore: store,
            }).then((wrapper) => {
                expect(wrapper.vm.$options.directives)
                    .to.have.property('touch');
                done();
            });
        });

    });


});
