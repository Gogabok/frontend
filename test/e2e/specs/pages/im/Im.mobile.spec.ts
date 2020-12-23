import Sizes from 'utils/Sizes';
import runTests from './Im.core';


const params = {
    beforeEachTest: () => {
        cy.viewport(
            Sizes.screen.mobile.width,
            Sizes.screen.mobile.height,
        );
        cy.wait(500);
        if (Cypress.$('.debug-dimensions').length > 0) {
            cy.get('.debug-dimensions').click();
        }
    },
    beforeTests: () => {
        cy.viewport(
            Sizes.screen.mobile.width,
            Sizes.screen.mobile.height,
        );
        cy.visit('/im');
        cy.get('.toggle-menu-sidebar').click({ force: true });
        cy.get('.menu nav').should('be.visible');
        cy.get('.menu nav .login-button').click({ force: true });
        cy.get('.toggle-menu-sidebar').click({ force: true });
    },
    closeMessageMenu: () => cy.get('.messages-list .close-button.icon').click(),
    closeMessages: () => cy.get('.messages-list .close-button.icon').click(),
    name: 'Im page on mobile device',
};

runTests(params, 15);
