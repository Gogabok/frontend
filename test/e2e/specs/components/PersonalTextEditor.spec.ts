// eslint-disable-next-line max-len
describe('components/common/modal-windows/personal-text-editor/PersonalTextEditor.vue', () => {


    describe('PersonalTextEditor', () => {

        before(() => {
            cy.visit('/');
            cy.get('.toggle-menu-sidebar').click({ force: true });
            cy.get('.menu nav .login-button').click();

            cy.get('nav .gapopa-item-container').should('be.visible');
            cy.get('.gapopa-container').click();
            cy.get('.personal-text-editor').should('be.visible');
        });

        it('show editable content', () => {
            cy.get('.personal-text-editor .editable-content-container')
                .should('be.visible');
        });

        describe('buttons panel', () => {

            it('hided default', () => {
                cy.get('.personal-text-editor .editable-content-container')
                    .should('have.class', 'toggled');
            });

            it('shown on focus', () => {
                cy.get('.personal-text-editor .editable-content')
                    .focus();
                cy.get('.personal-text-editor .editable-content-container')
                    .should('not.have.class', 'toggled');
            });

            it('hided on blur', () => {
                cy.wait(500);
                cy.get('.account-info-container .header-content')
                    .click('topRight');
                cy.get('.personal-text-editor .editable-content-container')
                    .should('have.class', 'toggled');
            });

        });

        describe('on save behaviour', () => {

            context('without translation', () => {

                before(() => {
                    cy.get('label.translate-input :checkbox')
                        .uncheck({ force: true });
                    cy.get('.personal-text-editor .btns .icn.send').click();
                });

                it('hide buttons panel', () => {
                    cy.get('.personal-text-editor .editable-content-container')
                        .should('have.class', 'toggled');
                });

            });

            context('with translation', () => {

                before(() => {
                    cy.get('.personal-text-editor .editable-content')
                        .focus();
                    cy.get('label.translate-input :checkbox')
                        .check({ force: true });
                    cy.get('.personal-text-editor .btns .icn.send').click();
                });

                it('show confirmation page', () => {
                    cy.get('.personal-text-editor .editable-content-container')
                        .should('not.be.visible');
                    cy.get('.personal-text-editor .personal-text-window')
                        .should('be.visible');
                    cy.get('.personal-text-editor .actions.confirm-translation')
                        .should('be.visible');
                    cy.get('.personal-text-editor .actions.confirm-translation')
                        .click();
                });

                it('hide buttons panel', () => {
                    cy.get('.personal-text-editor .editable-content-container')
                        .should('be.visible');
                    cy.get('.personal-text-editor .editable-content-container')
                        .should('have.class', 'toggled');
                });

            });

        });

    });


});
