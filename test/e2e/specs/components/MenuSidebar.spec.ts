import Sizes from 'utils/Sizes';


describe('components/menu-sidebar/MenuSidebar.vue', () => {


    before(() => {
        cy.visit('/');
        cy.get('.toggle-menu-sidebar').click({ force: true });
    });


    describe('Saves fixed size', () => {

        context('on desktop screens', () => {

            it('must be correct size on xs screen', () => {
                cy.viewport(
                    Sizes.screen.desktop.xs.width,
                    Sizes.screen.desktop.xs.height,
                );
                cy.get('aside.menu').should(
                    'have.css',
                    'width',
                    `${Sizes.menuSidebar.width}px`,
                );
            });

            it('must be correct size on s screen', () => {
                cy.viewport(
                    Sizes.screen.desktop.s.width,
                    Sizes.screen.desktop.s.height,
                );
                cy.get('aside.menu').should(
                    'have.css',
                    'width',
                    `${Sizes.menuSidebar.width}px`,
                );
            });

            it('must be correct size on big screen', () => {
                cy.viewport(
                    Sizes.screen.desktop.big.width,
                    Sizes.screen.desktop.big.height,
                );
                cy.get('aside.menu').should(
                    'have.css',
                    'width',
                    `${Sizes.menuSidebar.width}px`,
                );
            });

        });

    });


});
