import enDict from 'assets/i18n/en.json';
import ruDict from 'assets/i18n/ru.json';


describe('components/lang-sidebar/LangSidebar.vue', () => {


    before(() => {
        cy.visit('settings');
    });


    describe('Changes validation language', () => {

        it('change language to English', () => {
            cy.get('.bottom-menu .right .lang-sidebar-item .link').click();
            cy.get('.langs-overlay .langs-list').first().click();
            cy.get('.login-setting-container .actions .assign').click();
            cy.get('.login-setting-container.modal');
            cy.get('.login-setting-container.modal .input-wrap.login input')
                .clear().type('@#$');
            cy.get('.login-setting-container.modal .input-wrap.login \
                .notice.error').should('be.visible');
            cy.get('.login-setting-container.modal .input-wrap.login \
                .notice.error').contains(enDict.validation.messages.login);
            cy.get('.login-setting-container .header .header-close').click();
        });

        it('change language to Russian', () => {
            cy.get('.bottom-menu .right .lang-sidebar-item .link').click();
            cy.get('.bottom-menu .langs-list>div').eq(4).click();
            cy.get('.login-setting-container .actions .assign').click();
            cy.get('.login-setting-container.modal');
            cy.get('.login-setting-container.modal .input-wrap.login input')
                .clear().type('@#$');
            cy.get('.login-setting-container.modal .input-wrap.login \
                .notice.error').should('be.visible');
            cy.get('.login-setting-container.modal .input-wrap.login \
                .notice.error').contains(ruDict.validation.messages.login);
        });

    });


});
