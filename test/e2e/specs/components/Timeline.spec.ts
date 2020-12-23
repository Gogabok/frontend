import Sizes from 'utils/Sizes';


describe('components/common/timeline/Timeline.vue', () => {


    before(() => {
        cy.visit('/im');
        cy.get('.toggle-menu-sidebar').click({ force: true });
        cy.get('.menu nav .login-button').click();
        cy.get('.toggle-menu-sidebar').click({ force: true });
    });


    describe('Timeline', () => {

        context('on desktop screens', () => {

            it('must be visible', () => {
                cy.viewport(
                    Sizes.screen.desktop.s.width,
                    Sizes.screen.desktop.s.height,
                );
                cy.get('.timeline').should('be.visible');
            });

            it('has periods', () => {
                cy.get('.timeline li.main').should('be.visible');
            });

        });

        context('on tables screens', () => {

            it('must be hidden', () => {
                cy.viewport(
                    Sizes.screen.desktop.xs.width,
                    Sizes.screen.desktop.xs.height,
                );
                cy.get('.timeline').should('be.not.visible');
            });

        });


    });


});
