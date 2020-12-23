import Sizes from 'utils/Sizes';


describe('components/app/App.vue', () => {


    before(() => {
        cy.visit('/');
    });


    describe('App', () => {

        context('mobile view', () => {

            beforeEach(() => {
                cy.viewport(
                    Sizes.screen.mobile.width,
                    Sizes.screen.mobile.height,
                );
                cy.wait(500);
                cy.visit('/');
            });

            it.skip('hide opened aside windows on open new', () => { // TODO
                cy.get('a.sign-in').click();
                cy.get('.authorization-container').should('be.visible');
                cy.get('a.sign-up').click({ force: true });
                cy.get('.authorization-container.after-login')
                    .should('be.visible');
                cy.get('.actions.additional a.continue').click();
                cy.get('.authorization-container').should('not.be.visible');

                cy.get('.account-quick-access-container')
                    .should('not.be.visible');
                cy.get('.gapopa-container').click();
                cy.get('.account-quick-access-container')
                    .should('be.visible');

                cy.wait(500);
                cy.get('.toggle-menu-sidebar').click({ force: true });
                cy.get('aside.menu').should('be.visible');
                cy.get('.account-quick-access-container')
                    .should('not.be.visible');

                cy.wait(500);
                cy.get('.gapopa-container').click();
                cy.get('.account-quick-access-container').should('be.visible');
                cy.get('aside.menu').should('not.be.visible');
            });

            it('lock background if open any aside window', () => {
                cy.get('body').should('not.have.class', 'locked');

                cy.get('.top-menu .sign-in').click();
                cy.get('.authorization-container')
                    .should('be.visible');
                cy.get('body').should('have.class', 'locked');

                cy.wait(500);
                cy.get('.toggle-menu-sidebar').click({ force: true });
                cy.get('aside.menu').should('be.visible');
                cy.get('body').should('have.class', 'locked');

                cy.wait(500);
                cy.get('.toggle-menu-sidebar').click({ force: true });
                cy.get('aside.menu').should('not.be.visible');
                cy.get('body').should('not.have.class', 'locked');
            });

        });

    });


});
