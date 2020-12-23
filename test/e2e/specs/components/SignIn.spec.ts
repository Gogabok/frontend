// eslint-disable-next-line max-len
describe('components/common/modal-windows/authorization/components/sign-in/SignIn.vue', () => {


    before(() => {
        cy.visit('/');
        cy.get('a.sign-in').click();
    });


    describe('SignIn', () => {

        it('show login input', () => {
            cy.get('.sign-in-container input.login').should('be.visible');
            cy.get('.authorization-container .header-close').click();
        });

        describe('spinner', () => {

            before(() => {
                cy.get('a.sign-in').click();
                cy.get('.sign-in-container').should('be.visible');

                cy.get('.sign-in-container input.login').type('test{enter}');
            });

            it.skip('shown on request', () => {
                cy.get('.authorization-container .spinner')
                    .should('be.visible');
            });

            it('hide after', () => {
                cy.get('.authorization-container .spinner')
                    .should('not.be.visible');
            });

        });

        context('login empty', () => {

            it('show error', () => {
                cy.get('.sign-in-container input.login')
                    .clear().type('{enter}');
                cy.get('.validation-error').should('be.visible');
            });

        });

        context('login not exists', () => {

            it('show error', () => {
                cy.get('.sign-in-container input.login')
                    .clear().type('qwerty{enter}');
                cy.get('.validation-error').should('be.visible');
            });

        });

        context('login exists', () => {

            it('show page with password input', () => {
                cy.get('.sign-in-container input.login').clear()
                    .type('user1_login{enter}');
                cy.get('.sign-in-container input.login.password')
                    .should('be.visible');
                cy.get('.validation-error').should('not.be.visible');
            });

            it('show recovery message on restore password click', () => {
                cy.get('.sign-in-container .restore-password').click();
                cy.get('.sign-in-container .info-container')
                    .should('be.visible');
            });

            it('show error message on input invalid restore email', () => {
                cy.get('.sign-in-container .restore-email input')
                    .type('invalid@');
                cy.get('.restore-email .notice.error').should('be.visible');
                cy.get('.sign-in-container .restore-email input')
                    .clear().type('valid@mail.ma');
                cy.get('.sign-in-container .next:first-child').click();
                cy.get('.sign-in-container .next.back').click();
            });

            context('password empty', () => {

                it('show error', () => {
                    cy.get('.sign-in-container input.login.password').clear()
                        .type('{enter}');
                    cy.get('.validation-error').should('be.visible');
                });

            });

            context('password wrong', () => {

                it('show error', () => {
                    cy.get('.sign-in-container input.login.password').clear()
                        .type('1{enter}');
                    cy.get('.validation-error').should('be.visible');
                });

            });

            context('password valid', () => {

                before(() => {
                    cy.get('.sign-in-container input.login.password').clear()
                        .type('user1_password{enter}');
                });

                it('hide form', () => {
                    cy.get('.sign-in-container input.login')
                        .should('not.be.visible');
                });

                it('show user info in nav menu', () => {
                    cy.get('nav .gapopa-item-container')
                        .should('be.visible');
                });

            });

        });

        it.skip('add accounts to saved section and remove them', () => {
            cy.wait(300);
            const logins = ['&11', '&12', '&13'];
            logins.forEach((login) => {
                cy.get('a.sign-in').click();
                cy.get('.sign-in-container input.login')
                    .type(`${login}{enter}`);

                cy.get('.icon.remember-input').should('be.visible');
                if (login === '&13') {
                    cy.get('label.remember-input [type="checkbox"]')
                        .uncheck({ force: true });
                } else {
                    cy.get('label.remember-input [type="checkbox"]')
                        .check({ force: true });
                }

                cy.get('.sign-in-container input.login.password')
                    .type('valid-password{enter}');
                cy.get('nav .gapopa-item-container').should('be.visible');

                cy.get('.toggle-menu-sidebar').click({ force: true });
                cy.get('.menu nav .logout-button').click();
            });

            cy.get('a.sign-in').click();
            cy.get('.saved-items-container').should('be.visible')
                .find('.saved-gapopa-item')
                .should('have.length', 2);

            cy.get('.remove-gapopa .icon.remove').first()
                .click({ force: true });
            cy.get('.saved-items-container .saved-gapopa-item')
                .should('have.length', 1);

            cy.get('.saved-gapopa-container .actions a.next').click();
            cy.get('.clear-confirm-container').should('be.visible');
            cy.get('.clear-confirm-container a.confirm').click();
            cy.get('.clear-confirm-container').should('not.be.visible');
            cy.get('.saved-items-container .saved-gapopa-item')
                .should('have.length', 0);
            cy.get('.authorization-container .header-close').click();
        });

        it.skip('go to enter password dialog on click saved account', () => {
            cy.get('a.sign-in').click();
            cy.get('.sign-in-container input.login:first-child')
                .type('user1_login{enter}');
            cy.get('.sign-in-container input.login.password')
                .type('user1_password{enter}');
            cy.get('nav .gapopa-item-container').should('be.visible');

            cy.get('.toggle-menu-sidebar').click({ force: true });
            cy.get('.menu nav .logout-button').click();

            cy.get('a.sign-in').click();
            cy.get('.saved-items-container .saved-gapopa-item')
                .first().click();
            cy.get('.sign-in-container input.login.password')
                .should('be.visible');

            cy.get('.authorization-container .header-close').click().click();
        });

    });


});
