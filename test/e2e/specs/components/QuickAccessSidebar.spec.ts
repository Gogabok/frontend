import Sizes from 'utils/Sizes';


describe('components/quick-access-sidebar/QuickAccessSidebar.vue', () => {


    before(() => {
        cy.visit('/');
    });


    describe('Must be hidden', () => {

        context('on mobile screens (max. 756px)', () => {

            before(() => {
                cy.viewport(
                    Sizes.screen.mobile.width,
                    Sizes.screen.mobile.height,
                );
            });

            it('must be hidden', () => {
                cy.get('aside.quick-access').should('not.be.visible');
            });

        });

    });


    describe('Saves fixed size', () => {

        context('on desktop screens', () => {

            it('must be correct size on xs screen', () => {
                cy.viewport(
                    Sizes.screen.desktop.xs.width,
                    Sizes.screen.desktop.xs.height,
                );
                cy.get('aside.quick-access').should(
                    'have.css',
                    'width',
                    `${Sizes.quickAccessSidebar.width}px`,
                );
            });

            it('must be correct size on s screen', () => {
                cy.viewport(
                    Sizes.screen.desktop.s.width,
                    Sizes.screen.desktop.s.height,
                );
                cy.get('aside.quick-access').should(
                    'have.css',
                    'width',
                    `${Sizes.quickAccessSidebar.width}px`,
                );
            });

            it('must be correct size on big screen', () => {
                cy.viewport(
                    Sizes.screen.desktop.big.width,
                    Sizes.screen.desktop.big.height,
                );
                cy.get('aside.quick-access').should(
                    'have.css',
                    'width',
                    `${Sizes.quickAccessSidebar.width}px`,
                );
            });

        });

    });


});
