import Sizes from 'utils/Sizes';
import runTests from './Im.core';


const params = {
    beforeEachTest: () => undefined,
    beforeTests: () => {
        cy.viewport(
            Sizes.screen.desktop.big.width,
            Sizes.screen.desktop.big.height,
        );
        cy.visit('/im');
        cy.get('.toggle-menu-sidebar').click({ force: true });
        cy.get('.menu nav .login-button').click({ force: true });
        cy.get('.toggle-menu-sidebar').click({ force: true });
    },
    closeMessageMenu: () => {
        cy.get('.message-menu-container .header-close > .icon').click();
    },
    closeMessages: () => undefined,
    name: 'Im page',
};

runTests(params, 5);
