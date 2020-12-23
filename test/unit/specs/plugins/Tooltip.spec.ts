import { expect } from 'chai';

import Tooltip from 'plugins/Tooltip';
import store from 'store';
import AppType from 'components/app/web/App';

import App from 'components/app/web/App.vue';

import Helper from '../../HelperTestUtils';


describe('Tooltip.ts', () => {


    describe('init()', () => {

        it('initializes v-tooltip plugin correctly', (done: Mocha.Done) => {
            Tooltip.init();
            Helper.initApp<AppType>({
                component: App,
                mockStore: store,
            }).then((wrapper) => {
                expect(wrapper.vm.$options.directives)
                    .to.have.property('tooltip');
                done();
            });
        });

    });


});
