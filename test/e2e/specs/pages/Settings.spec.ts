import { name, random } from 'faker';


describe('Settings page', () => {


    before(() => {
        cy.visit('settings');
    });


    it('contains navigation links', () => {
        cy.get('.navigation-bar-container .actions [data-tab-name=account]');
        cy.get('.navigation-bar-container .actions [data-tab-name=security]');
        cy.get('.navigation-bar-container .actions [data-tab-name=privacy]');
    });


    describe('Account tab', () => {

        before(() => {
            cy.get('.navigation-bar-container [data-tab-name=account]').click();
        });

        describe.skip('Num', () => {

            it('contains Num setting container', () => {
                cy.get('.num-setting-container');
            });

            it('open modal editor', () => {
                cy.get('.num-setting-container .actions .assign').click();
                cy.get('.num-setting-container.modal');
            });

            it.skip('shown and hide loading indicator', () => {
                cy.get('.num-setting-container.modal .num-container' +
                    ' .spinner-overlay').should('be.visible');
                cy.get('.num-setting-container.modal .num-container' +
                    ' .spinner-overlay').should('not.be.visible');
            });

            it('shown Num value', () => {
                cy.get('.num-setting-container.modal .num')
                    .should('be.visible');
            });

            it('hide modal form if Num assigned', () => {
                cy.get('.num-setting-container.modal .num-container' +
                    ' .actions a.continue').click();
                cy.get('.num-setting-container.modal')
                    .should('not.be.visible');
            });

            it('shows copy btn', () => {
                cy.get('.num-setting-container .actions .copy')
                    .should('exist');
            });

        });

        describe('Default ID', () => {

            it('contains Default ID setting container', () => {
                cy.get('.default-id-setting-container');
            });

            it('shows change btn', () => {
                cy.get('.default-id-setting-container .actions .change')
                    .should('exist');
            });

        });

        describe('Name field', () => {

            let nameFieldValue = '';

            it('contains name setting container', () => {
                cy.get('.name-setting-container');
            });

            it('open modal editor', () => {
                cy.get('.name-setting-container .actions .assign').click();
                cy.get('.name-setting-container.modal');
            });

            it('shown name field', () => {
                cy.get('.name-setting-container.modal .input-wrap.name input');
            });

            it('shown error if name field is empty', () => {
                cy.get('.name-setting-container.modal .input-wrap.name input')
                    .clear().type('{enter}');
                cy.get('.name-setting-container.modal .input-wrap.name \
                    .notice.error \
                ').should('be.visible');
            });

            it('shown error if exceed the maximum number of characters' +
            ' allowed (100)', () => {
                cy.get('.name-setting-container.modal .input-wrap.name input')
                    .clear().type(Array(102).join('w'));
                cy.get('.name-setting-container.modal .input-wrap.name \
                    .notice.error \
                ').should('be.visible');
            });

            it('shown error if entered invalid name', () => {
                cy.get('.name-setting-container.modal .input-wrap.name input')
                    .clear().type(' 0!@#{enter}');
                cy.get('.name-setting-container.modal .input-wrap.name \
                    .notice.error \
                ').should('be.visible');
            });

            it('hide modal editor when name is assigned', () => {
                nameFieldValue = name.firstName(1) + name.lastName(1);
                cy.get('.name-setting-container.modal .input-wrap.name input')
                    .clear().type(nameFieldValue + '{enter}');
                cy.get('.name-setting-container.modal')
                    .should('not.be.visible');
            });

            it('contains assigned name', () => {
                cy.get('.name-setting-container .header-name .value')
                    .should('have.text', nameFieldValue);
            });

            it('shows change btn', () => {
                cy.get('.name-setting-container .actions .change');
            });

            it('changes name', () => {
                nameFieldValue = 'New Name';
                cy.get('.name-setting-container .actions .change').click();
                cy.get('.name-setting-container.modal .input-wrap.name input')
                    .clear().type(nameFieldValue + '{enter}');
                cy.get('.name-setting-container.modal')
                    .should('not.be.visible');
                cy.get('.name-setting-container .header-name .value')
                    .should('have.text', nameFieldValue);
            });

            it('delete confirmed name', () => {
                nameFieldValue = name.firstName(0) + name.lastName(0);
                cy.get('.name-setting-container .actions .change').click();
                cy.get('.name-setting-container.modal .input-wrap.name input')
                    .clear().type(nameFieldValue + '{enter}');
                cy.get('.name-setting-container .actions .change').click();
                cy.get('.name-setting-container.modal .actions a')
                    .first().click({ force: true });
                cy.get('.name-setting-container.modal .input-wrap.name input')
                    .should('not.have.text');
            });

        });

        describe('Unique login', () => {

            it('contains login setting container', () => {
                cy.get('.login-setting-container');
            });

            it('open modal editor', () => {
                cy.get('.login-setting-container .actions .assign').click();
                cy.get('.login-setting-container.modal');
            });

            it('shown login field', () => {
                cy.get('.login-setting-container.modal .input-wrap.login input')
                    .should('be.visible');
            });

            it('shown error if entered invalid login', () => {
                cy.get('.login-setting-container.modal .input-wrap.login input')
                    .clear().type('@#$');
                cy.get('.login-setting-container.modal .input-wrap.login \
                    .notice.error \
                ')
                    .should('be.visible');
            });

            it('shown error if length less than minimum number of characters' +
            ' allowed (3)', () => {
                cy.get('.login-setting-container.modal .input-wrap.login input')
                    .clear().type(Array(2).join('X'));
                cy.get('.login-setting-container.modal .input-wrap.login \
                    .notice.error \
                ')
                    .should('be.visible');
            });

            it('shown error if exceed the maximum number of characters' +
            ' allowed (20)', () => {
                cy.get('.login-setting-container.modal .input-wrap.login input')
                    .clear().type(Array(22).join('X'));
                cy.get('.login-setting-container.modal .input-wrap.login \
                    .notice.error \
                ')
                    .should('be.visible');
            });

            it('shown error if using existed login', () => {
                cy.get('.login-setting-container.modal .input-wrap.login input')
                    .clear().type('user1_login{enter}');
                cy.get('.login-setting-container.modal .input-wrap.login \
                    .notice.error \
                ')
                    .should('be.visible');
            });

            it('hide login field if login accepted', () => {
                cy.get('.login-setting-container.modal .input-wrap.login input')
                    .clear().type(
                        `${random.word().toLowerCase().substr(0, 6)}{enter}`,
                    );
                cy.get('.login-setting-container.modal')
                    .should('not.be.visible');
                cy.get('.login-setting-container .actions .copy');
            });

        });

        describe('Add email', () => {

            it('contains email setting container', () => {
                cy.get('.email-setting');
            });

            it('open modal editor', () => {
                cy.get('.email-setting .actions .add').click();
                cy.get('.email-setting.modal');
            });

            it('shown email field', () => {
                cy.get('.email-setting.modal .input-wrap.email input');
            });

            it('shown error if entered invalid email', () => {
                cy.get('.email-setting.modal .input-wrap.email input')
                    .clear().type('invalidEmail').blur();
                cy.get('.email-setting.modal .input-wrap.email \
                    .notice.error \
                ')
                    .should('be.visible');
                cy.get('.email-setting.modal .header .header-close').click();
            });

            it('shown error if using existed email', () => {
                cy.get('.email-setting .actions .add').click();
                cy.get('.email-setting.modal .input-wrap.email input')
                    .clear().type(
                        'user1_email@example.com{enter}',
                        { force: true },
                    );
                cy.get('.email-setting.modal .input-wrap.email \
                    .notice.error \
                ')
                    .should('be.visible');
            });

            it('email accept', () => {
                cy.get('.email-setting.modal .input-wrap.email input')
                    .clear().type('valid@email.com{enter}', { force: true });
                cy.wait(1000);
                cy.get('.email-setting.modal .input-wrap.email')
                    .should(($list) => {
                        expect($list.find('.notice.error')).to.have.length(0);
                    });
            });

            it('shown unconfirmed label if email accepted', () => {
                cy.get('.email-unconfirmed-label').should('be.visible');
            });

        });

        describe.skip('Avatar', () => {

            it('contains avatar setting container', () => {
                cy.get('.avatar-setting-container');
            });

            it('open modal editor', () => {
                cy.get('.avatar-setting-container .actions .change').click();
                cy.get('.avatar-editor-container').should('exist');
                cy.get('.avatar-editor-container .menu .actions .cancel')
                    .click();
            });

            it('auto login if user not logged', () => {
                cy.get('.gapopa-container.login').should('exist');
            });

        });

    });


    describe('Security tab', () => {

        before(() => {
            cy.get('.navigation-bar-container .actions \
                [data-tab-name=security]').click();
        });

        describe('Password', () => {

            it('contains password setting container', () => {
                cy.get('.password-setting-container');
            });

            it('open modal editor', () => {
                cy.get('.password-setting-container .actions .assign').click();
                cy.get('.password-setting-container.modal');
            });

            it('shown password fields', () => {
                cy.get('.password-setting-container.modal .new-password input')
                    .should('be.visible');
                cy.get('.password-setting-container.modal .repeat-password \
                    input').should('be.visible');
            });

            it('shown error if password is too short', () => {
                cy.get('.password-setting-container.modal .new-password input')
                    .clear().type('123').blur();
                cy.get('.password-setting-container.modal .new-password \
                    .notice.error \
                ')
                    .should('be.visible');
            });

            it('shown error if password not strong enough', () => {
                cy.get('.password-setting-container.modal .new-password input')
                    .clear().type(' password').blur();
                cy.get('.password-setting-container.modal .new-password \
                    .notice.error \
                ')
                    .should('be.visible');
            });

            it('hide password field if password accepted', () => {
                cy.get('.password-setting-container.modal .new-password input')
                    .clear().type('ValidPa55word');
                cy.get('.password-setting-container.modal .repeat-password \
                    input').clear().type('ValidPa55word');
                cy.get('.password-setting-container.modal .menu .continue')
                    .click();
                cy.get('.password-setting-container.modal')
                    .should('not.be.visible');
            });

            it('shows change btn', () => {
                cy.get('.password-setting-container .actions .change');
            });

            // eslint-disable-next-line max-len
            it.skip('shows error on change password with wrong old password', () => {
                cy.get('.password-setting-container .actions .change').click();
                cy.get('.password-setting-container.modal');
                cy.get('.password-setting-container.modal .old-password input')
                    .clear().type('invalidOldPassword');
                cy.get('.password-setting-container.modal .new-password input')
                    .clear().type('ValidPa55word');
                cy.get('.password-setting-container.modal .repeat-password \
                    input').clear().type('ValidPa55word');
                cy.get('.password-setting-container.modal .menu .continue')
                    .click();
                cy.get('.password-setting-container.modal .old-password \
                    .notice.error \
                ')
                    .should('be.visible');
            });

            it.skip('changes password', () => {
                cy.get('.password-setting-container.modal .old-password input')
                    .clear().type('ValidPa55word');
                cy.get('.password-setting-container.modal .new-password input')
                    .clear().type('ValidPa55word');
                cy.get('.password-setting-container.modal .repeat-password \
                    input').clear().type('ValidPa55word');
                cy.get('.password-setting-container.modal .menu .continue')
                    .click();
                cy.get('.password-setting-container.modal')
                    .should('not.be.visible');
            });

        });

    });


});
