// eslint-disable-next-line max-len
describe('components/common/sidebars/account-quick-access-panel/AccountQuickAccessPanel.vue', () => {

    before(() => {
        cy.visit('/');

        cy.get('a.sign-in').click();
        cy.wait(500);
        cy.get('a.sign-up').click();
        cy.get('.header-close').click();
        cy.get('.authorization-container').should('not.be.visible');
        cy.get('.a.sign-in').should('not.be.visible');
        cy.get('.gapopa-container.login').should('be.visible');
        cy.get('.gapopa-container').click();
    });

    describe('AccountQuickAccessPanel', () => {


        describe('account-quick-access-container window', () => {

            it('closed on click outside', () => {
                cy.get('.account-quick-access-container')
                    .should('be.visible');
                cy.get('main').click('center', { force: true });
                cy.get('.account-quick-access-container')
                    .should('not.be.visible');
                cy.get('.gapopa-container').click();
            });

        });


        describe('password fields', () => {

            it('shown password and repeat-password fields', () => {
                cy.get('.additional-content .input-wrap.password input')
                    .should('be.visible');
                cy.get('.additional-content .input-wrap.repeat-password input')
                    .should('be.visible');
            });

            it('shown error if the password length is less than 6' +
            ' characters', () => {
                cy.get('.additional-content .input-wrap.password input')
                    .clear().type('12345').blur();
                cy.get('.additional-content .input-wrap.password .notice.error')
                    .should('be.visible');
            });

            it('shown error if passwords dont match', () => {
                cy.get('.additional-content .input-wrap.password input')
                    .clear().type('123456').blur();
                cy.get('.additional-content .input-wrap.repeat-password input')
                    .clear().type('654321').blur();
                cy.get('.additional-content .input-wrap.repeat-password '
                    + '.notice.error').should('be.visible');
            });

            it('hide password fields if password accepted', () => {
                cy.get('.additional-content .input-wrap.password input')
                    .clear().type('validpassword').blur();
                cy.get('.additional-content .input-wrap.repeat-password input')
                    .clear().type('validpassword').blur();
                cy.get('.additional-content .confirm .continue').click();
                cy.get('.additional-content .password')
                    .should('not.be.visible');
                cy.get('.additional-content .repeat-password')
                    .should('not.be.visible');
            });

        });


        describe('login field', () => {

            it('shown login field', () => {
                cy.get('.additional-content .input-wrap.login input')
                    .should('be.visible');
            });

            it('shown error if entered invalid login', () => {
                cy.get('.additional-content .input-wrap.login input')
                    .clear().type('@#$');
                cy.get('.additional-content .input-wrap.login .notice.error')
                    .should('be.visible');
            });

            it('shown error if exceed the maximum number of characters' +
            ' allowed (20)', () => {
                cy.get('.additional-content .input-wrap.login input')
                    .clear().type(Array(22).join('X'));
                cy.get('.additional-content .input-wrap.login .notice.error')
                    .should('be.visible');
            });

            it.skip('shown error if using existed login', () => {
                cy.get('.additional-content .input-wrap.login input')
                    .clear().type('user1_login{enter}');
                cy.get('.additional-content .input-wrap.login .notice.error')
                    .should('be.visible');
            });

            it.skip('hide login field if login accepted', () => {
                cy.get('.additional-content .input-wrap.login input')
                    .clear().type('validlogin{enter}');
                cy.get('.additional-content .login')
                    .should('not.be.visible');
            });

        });


        describe.skip('email field', () => {

            it('shown email field', () => {
                cy.get('.additional-content .input-wrap.email input')
                    .should('be.visible');
            });

            it('error not shown', () => {
                cy.get('.additional-content .input-wrap.email .notice.error')
                    .should('not.be.visible');
            });

            it('shown error if entered invalid email', () => {
                cy.get('.additional-content .input-wrap.email input')
                    .clear().type('0{enter}');
                cy.get('.additional-content .input-wrap.email .notice.error')
                    .should('be.visible');
            });

            it('hide email field if email accepted', () => {
                cy.get('.additional-content .input-wrap.email input')
                    .clear().type('valid@email.com{enter}');
                cy.get('.additional-content .input-wrap.email input')
                    .should('not.be.visible');
            });

        });


        describe('name field', () => {

            const inputSelector =
                '.additional-content .input-wrap.name input';
            const errorSelector =
                '.additional-content .input-wrap.name .notice.error';

            it('shown name field', () => {
                cy.get(inputSelector).should('be.visible');
            });

            it('error not shown', () => {
                cy.get(errorSelector).should('not.be.visible');
            });

            it.skip('shown error if entered invalid name', () => {
                cy.get(inputSelector).clear().type(' 0!@#{enter}');
                cy.get(errorSelector).should('be.visible');
            });

            it.skip('hide field if name accepted', () => {
                cy.get(inputSelector).clear().type('Инокентий{enter}');
                cy.get(inputSelector).should('not.be.visible');
            });

        });


        describe.skip('avatar load', () => {

            it('shown avatar load', () => {
                cy.get('.additional-content .avatar-load')
                    .should('be.visible');
            });

            it('open avatar editor on click', () => {
                cy.get('.additional-content .avatar-load')
                    .click();
                cy.get('.avatar-editor')
                    .should('be.visible');
                cy.get('.avatar-editor-container .header-close')
                    .click();
            });

        });

    });


});
