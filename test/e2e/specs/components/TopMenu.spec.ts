import Sizes from 'utils/Sizes';


describe('components/top-menu/TopMenu.vue', () => {
    before(() => {
        cy.visit('/');
    });


    describe('TopMenu', () => {

        it('has correct height', () => {
            cy.viewport(
                Sizes.screen.desktop.xs.width,
                Sizes.screen.desktop.xs.height,
            );
            cy.get('.top-menu').should(
                'have.css',
                'height',
                `${Sizes.header.height}px`,
            );
        });

        it('toggles sidebar menu', () => {
            cy.get('.toggle-menu-sidebar').click();
            cy.get('aside.menu').should('be.visible');

            cy.get('.toggle-menu-sidebar').click();
            cy.get('aside.menu').should('not.be.visible');
        });

        it('toggles quick access sidebar on big screens ( > 760px)', () => {
            cy.viewport(
                Sizes.screen.desktop.big.width,
                Sizes.screen.desktop.big.height,
            );
            cy.get('.im-link').click();
            cy.get('aside.quick-access').should('have.class', 'active');

            cy.get('.im-link').click();
            cy.get('aside.quick-access').should('not.have.class', 'active');
        });

        it('toggles languages list', () => {
            cy.get('.lang-link').click();
            cy.get('.langs-overlay').should('have.class', 'active');
            cy.get('.langs-list').should('be.visible');

            cy.get('.lang-link').click();
            cy.get('.langs-overlay').should('not.have.class', 'active');
            cy.get('.langs-list').should('not.be.visible');
        });

    });


});
