import en from 'assets/i18n/en.json';


describe('Confirmation page', () => {

    const recoveryToken =
        'eyJpZCI6IjhkNGUwYjA2LTJjOGYtNDEzMS1hZGQ5LThlZTRmNzdkMDZhYiIsInNlY3JldCI6IlJqTUVBZ3I3QUc2cVB2c2l1eWRRR09QMW1XQlEwMklqYWhXcEZlcW5tZ1E9In0='; //eslint-disable-line
    const recoveryLink = `recover/password/?t=${recoveryToken}`;


    describe('new password field and actions', () => {

        beforeEach(() => {
            cy.visit(recoveryLink);
        });

        it('has newPassword text field', () => {
            cy.get('.modal-window .header').should('be.visible');
            cy.get('.modal-window .inner .confirmation > span')
                .should('be.visible');
            cy.get('.modal-window .inner .reset-info')
                .should('be.visible');
            cy.get('.modal-window .inner .actions .link')
                .should('be.visible');
        });

        it('show error message when invalid link', () => {
            cy.get('.modal-window .inner .confirmation > span')
                .type('newpass');
            cy.get('.modal-window .inner .actions .link')
                .click({ force: true });
            cy.get('.modal-window .reset-info').contains(
                en.pages['confirm-page']['confirmation-error'],
            );
        });

    });


});
