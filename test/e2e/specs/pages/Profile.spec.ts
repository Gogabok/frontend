describe('Profile page', () => {


    before(() => {
        cy.visit('u/1');
    });


    describe('profile information', () => {

        it('should loads user profile', () => {
            cy.get('.page > .loading-spinner').should('not.exist');
        });

        it('toggles user information by click on user name', () => {
            cy.get('.profile-information .show-details').click();
            cy.get('.profile-information .details')
                .should('be.visible');
            cy.get('.profile-information .show-details').click();
            cy.get('.profile-information .details')
                .should('not.be.visible');
        });

        it('hides save button if validation errors exists', () => {
            cy.get('.details .update').should('not.exist');
        });

    });


});
