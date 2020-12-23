// eslint-disable-next-line max-len
describe('components/common/modal-windows/authorization/Authorization.vue', () => {


    before(() => {
        cy.visit('/');
    });


    describe('Authorization', () => {

        it('must be hidden default', () => {
            cy.get('.authorization-container').should('not.be.visible');
        });

        it('shown on click sign-in link', () => {
            cy.get('a.sign-in').click();
            cy.get('.authorization-container').should('be.visible');
        });

        it('close on click close button', () => {
            cy.get('.authorization-container .header-close').click();
            cy.get('.authorization-container').should('not.be.visible');
        });

        it('sign up new user', () => {
            cy.get('a.sign-in').click();
            cy.wait(300);
            cy.get('a.sign-up').click();
            cy.get('.after-login').should('be.visible');
            cy.get('.additional a').click();
            cy.get('.authorization-container').should('not.be.visible');
            cy.get('.a.sign-in').should('not.be.visible');
            cy.get('.gapopa-container.login').should('be.visible');
        });

    });


});
