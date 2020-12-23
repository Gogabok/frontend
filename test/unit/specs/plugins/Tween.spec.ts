import { expect } from 'chai';

import Tween from 'plugins/Tween';
import store from 'store';
import AppType from 'components/app/web/App';

import App from 'components/app/web/App.vue';

import Helper from '../../HelperTestUtils';


describe('Tween.ts', () => {


    describe('access to Tween api', () => {

        it('animateElementProperty', (done: Mocha.Done) => {

            Helper.initApp<AppType>({
                component: App,
                mockStore: store,
            }).then((wrapper) => {

                const el: HTMLElement = document.createElement('div');
                el.style.top = '120px';

                Tween.animateElementProperty(el, 'top', 500).then(() => {
                    expect(el.style.top).to.be.equal('500px');
                });

                done();
            });
        });

    });


});
