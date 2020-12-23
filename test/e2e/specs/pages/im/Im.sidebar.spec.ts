import Sizes from 'utils/Sizes';
import runTests from './Im.core';


const params = {
    beforeEachTest: () => {
        cy.viewport(
            Sizes.screen.desktop.big.width,
            Sizes.screen.desktop.big.height,
        );
        cy.wait(500);
        if (!Cypress.$('.quick-access.hidden-mobile').hasClass('active')) {
            cy.get('header .im-link').click();
        }
    },
    beforeTests: () => {
        cy.visit('/');
        cy.get('.toggle-menu-sidebar').click({ force: true });
        cy.get('.menu nav .login-button').click();
        cy.get('.toggle-menu-sidebar').click({ force: true });
    },
    closeMessageMenu: () => cy.get('.messages-list .close-button.icon').click(),
    closeMessages: () => cy.get('.messages-list .close-button.icon').click(),
    name: 'Im sidebar',
};

runTests(params, 10);
