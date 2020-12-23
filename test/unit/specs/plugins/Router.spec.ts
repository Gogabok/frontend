import { expect } from 'chai';

import Router from 'Router';


describe('Router.ts', () => {


    describe('constructor()', () => {

        it('initializes vue-router plugin correctly', () => {
            const router = new Router().instance;
            expect(router)
                .to.have.property('options');
        });

    });


});
