import i18nJson from 'assets/i18n/en.json';
import ConversationListState from 'store/modules/conversation-list/state';
import MessagesListState from 'store/modules/messages-list/state';


const PAGE_NAME = 'Im page';
const SIDEBAR_NAME = 'Im sidebar';
const MOBILE_PAGE_NAME = 'Im page on mobile device';

const messagesCount = new MessagesListState().conversationMessagesPieceSize;
const contactsCount = new ConversationListState().limit;

const checkMessages = (
    messages: JQuery<HTMLElement>,
    count: number = messagesCount,
) => {
    const separateMessages: HTMLElement[] = [];
    messages.not('.status').find('.msg').each((i, msg) => {
        separateMessages.push(msg);
    });

    expect(separateMessages).to.have.length(count);
};

const contactMenuConfirm = (itemSelector: string) => {
    cy.get(itemSelector).click();

    cy.get('.contact-menu .confirm').click();

    cy.get('.contacts-list .header-close > .icon').click();
};

export default function runTest(params: unknown, caseIndex: number): unknown {
    return describe(`${params.name}`, () => {


        before(params.beforeTests);


        beforeEach(params.beforeEachTest);


        describe('conversations list', () => {

            if (params.name === MOBILE_PAGE_NAME) {

                it('shows header', () => {
                    cy.get('.contacts-list .menu-wrapper .menu')
                        .should('be.visible');
                });

            }

            it(
                'should load conversations and select first one in the list',
                () => {
                    cy.get('.contacts-list .contact:not(.empty)')
                        .should('have.length', contactsCount);
                    if (params.name === PAGE_NAME) {
                        cy.get('.contacts-list .contact:first')
                            .should('have.class', 'selected');
                    }
                },
            );

            it('toggles on favorite and back to last conversations', () => {
                cy.get('.contacts-list .menu-wrapper .all').click();
                cy.get('.contacts-list .contact')
                    .should('have.length.greaterThan', 0);
                cy.get('.contacts-list .menu-wrapper .recent').click();
                cy.get('.contacts-list .contact:not(.empty)')
                    .should('have.length', contactsCount);
            });

            it('remember active tab after page reload', () => {
                cy.get('.contacts-list .menu-wrapper .all').click();
                cy.visit(params.name === SIDEBAR_NAME ? '/' : '/im');
                params.beforeEachTest();
                cy.get('.contacts-list').should('be.visible')
                    .find('.contact:not(.favourite)')
                    .should('have.length', 0);
                cy.get('.contacts-list .menu-wrapper .recent').click();
            });

            describe('conversation menu', () => {

                beforeEach(params.beforeTests);

                // TODO: fix next unstable test.
                it.skip('removes contact from list', () => {
                    const i = contactsCount - 1 - caseIndex;
                    let contactName = '';
                    cy.get(
                        `.contacts-list .contact:nth-child(${i}) .name > span`,
                    ).should((span) => contactName = span.text());
                    cy.get(`.contacts-list .contact:nth-child(${i}) \
                    a.swipe-helper > .icon`).click({ force: true });
                    contactMenuConfirm('.contact-menu .remove-button');
                    cy.get(
                        `.contacts-list .contact:nth-child(${i}) .name > span`,
                    ).should((name) => {
                        expect(name.text()).to.be.not.eq(contactName);
                    });
                });

                it('blocks contact', () => {
                    const i = contactsCount - 2 - caseIndex;
                    let contactName = '';
                    cy.get(
                        `.contacts-list .contact:nth-child(${i}) .name > span`,
                    ).should((span) => contactName = span.text());
                    cy.get(`.contacts-list .contact:nth-child(${i}) \
                    a.swipe-helper > .icon`).click({ force: true });
                    contactMenuConfirm('.contact-menu .block-button');
                    cy.get(
                        `.contacts-list .contact:nth-child(${i}) .name > span`,
                    ).should((name) => {
                        expect(name.text()).to.be.not.eq(contactName);
                    });
                });

                it('renames contact', () => {
                    const i = contactsCount - 3 - caseIndex;
                    const contactNewName = Math.random().toString();
                    cy.get(`.contacts-list .contact:nth-child(${i}) \
                    a.swipe-helper > .icon`).click({ force: true });
                    cy.get('.rename-button').click();
                    cy.wait(500);
                    cy.get('.contact-menu-header [contenteditable=true]')
                        .clear().type(contactNewName).blur();
                    cy.get('.contacts-list .header-close > .icon').click();
                    cy.get(
                        `.contacts-list .contact:nth-child(${i}) .name > span`,
                    ).should('have.text', contactNewName);
                });

                // TODO: fix next unstable test.
                it.skip('adds contact to favourites', () => {
                    cy.get('.contacts-list .menu-wrapper .recent')
                        .click({ force: true });
                    let contactName = '';
                    cy.get('.contacts-list .contact:not(.favourite):first \
                    .name > span').should((span) => contactName = span.text());
                    cy.get('.contacts-list .contact:not(.favourite):first \
                    a.swipe-helper > .icon\
                ').click({ force: true });
                    cy.get('.add-remove-favourite.add-contact:first')
                        .click({ force: true });
                    cy.get('.contacts-list .header-close > .icon')
                        .click().click();
                    cy.get('.contacts-list .menu-wrapper .all')
                        .click({ force: true });
                    cy.get('.contacts-list .contact')
                        .should('have.length.greaterThan', 1);
                    cy.get('.contacts-list .contact.first .name > span')
                        .should((span) => {
                            expect(span.text()).to.be.eq(contactName);
                        });
                });

                it.skip('removes contact from favourites', () => {
                    cy.get('.contacts-list .menu-wrapper .all').click();
                    let contactName = '';
                    cy.get('.contacts-list .contact:first .name > span')
                        .should((span) => contactName = span.text());
                    cy.get(
                        '.contacts-list .contact:first a.swipe-helper > .icon',
                    ).click({ force: true });
                    cy.get('.add-remove-favourite.forget-contact')
                        .click({ force: true });
                    cy.get('.contacts-list .header-close > .icon').click();
                    cy.get('.contacts-list .contact .name > span')
                        .should((names) => names.each((index, name) => {
                            expect(name.innerHTML).to.be.not.eq(contactName);
                        }));
                });

                describe('support contact', () => {

                    beforeEach(() => {
                        cy.get('.contacts-list .menu-wrapper .recent').click();
                        const i = contactsCount - 3 - caseIndex;
                        cy.get(`.contacts-list .contact:nth-child(${i}) \
                        a.swipe-helper > .icon \
                    `).click({ force: true });
                        cy.get('.contact-menu .support-button:first').click();
                        cy.get('.make-donation .editable-content-container \
                        .btns .translate-input [type=checkbox]\
                    ').uncheck({ force: true });
                    });

                    afterEach(() => {
                        cy.get('.contacts-list .header-close > .icon')
                            .click().click();
                    });

                    it('supports contact', () => {
                        cy.get(
                            '.make-donation .editable-content-container .send',
                        ).click();
                        cy.get('.contact-menu .action-result.supported');
                    });

                    it('unable to make empty donation', () => {
                        cy.get('.make-donation .amount')
                            .focus().clear().type('0');
                        cy.get(
                            '.make-donation .editable-content-container .send',
                        ).click();
                        cy.wait(2000);
                        expect(
                            Cypress.$('.contact-menu .action-result.supported')
                                .length,
                        ).to.be.eq(0);
                        cy.get('.make-donation .notice').should(
                            'have.text',
                            i18nJson.components.im
                                .contacts['donation-fail']['empty-donation'],
                        );
                    });

                    it(
                        'unable to send more funds than active user have',
                        () => {
                            cy.get('.make-donation .amount').focus().clear()
                                .type('1000');
                            cy.get('.make-donation .editable-content-container \
                                .send').click();
                            cy.wait(2000);
                            expect(
                                Cypress.$('.contact-menu \
                                    .action-result.supported').length,
                            ).to.be.eq(0);
                            cy.get('.contact-menu .action-result.fail').should(
                                'have.text',
                                i18nJson.components.im
                                    .contacts['donation-fail']['no-funds'],
                            );
                        },
                    );

                });

                describe('share contact', () => {

                    beforeEach(() => {
                        cy.get('.contacts-list .menu-wrapper .recent').click();
                        const i = contactsCount - 3 - caseIndex;
                        cy.get(`.contacts-list .contact:nth-child(${i}) \
                        a.swipe-helper > .icon \
                    `).click({ force: true });
                        cy.get('.contact-menu .share-button:first').click();
                    });

                    afterEach(() => {
                        cy.get('.contacts-list .header-close > .icon')
                            .click().click();
                    });

                    it('shares contact', () => {
                        cy.get('.share-window .copy-link').click();
                        cy.get('.contact-menu .action-result.success');
                    });

                    describe.skip('edit link', () => {

                        let someLink: string;

                        beforeEach(() => {
                            cy.get('.share-window .edit').click();
                            cy.wait(500);
                        });

                        it('shares with generated link', () => {
                            cy.get('.share-window .generate').click();
                            cy.wait(200);
                            cy.get('.share-window .copy-link').click();
                            cy.get('.contact-menu .action-result.success');
                        });

                        it('shares with custom link', () => {
                            someLink = Math.random().toString().slice(2);
                            cy.get('.share-window .link textarea')
                                .focus().clear().type(someLink);
                            cy.get('.share-window .copy-link').click();
                            cy.get('.contact-menu .action-result.success');
                        });

                        it('unable to use existed link', () => {
                            cy.get('.share-window .link textarea')
                                .focus().clear().type('123');
                            cy.get('.share-window .copy-link').click();
                            cy.get('.share-window .error').should(
                                'have.text',
                                i18nJson.components['share-window'][
                                    'error-already-use'
                                ],
                            );
                        });

                        it('unable to copy empty link', () => {
                            cy.get('.share-window .copy-link').click();
                            cy.get('.share-window .error').should(
                                'have.text',
                                i18nJson.components['share-window'][
                                    'error-empty-link'
                                ],
                            );
                        });

                        it('unable to use not valid chars', () => {
                            cy.get('.share-window .link textarea')
                                .focus().clear().type('#@');
                            cy.get('.share-window .error').should(
                                'have.text',
                                i18nJson.components['share-window'][
                                    'error-unacceptable-symbols'
                                ],
                            );
                        });

                        it('unable to exceed the maximum number of characters' +
                            ' allowed (256)', () => {
                            cy.get('.share-window .link textarea')
                                .focus()
                                .clear()
                                .type(Array(258).join('1'));
                            cy.get('.share-window .error').should(
                                'have.text',
                                i18nJson.components['share-window'][
                                    'error-max-length'
                                ],
                            );
                        });

                    });

                });

            });

        });


        describe('messages list', () => {

            if (params.name === PAGE_NAME) {

                it('should load messages for active conversation', () => {
                    cy.get('.messages-list .messages-container .message')
                        .should(checkMessages);
                });

            }

            if (params.name === MOBILE_PAGE_NAME) {

                it('shows header and text input', () => {
                    cy.get('.contacts-list .contact:first')
                        .click({ force: true });
                    cy.get('.messages-list .messages-list-header .header')
                        .should('be.visible');
                    cy.get('.messages-list .editable-content')
                        .should('be.visible');
                    params.closeMessages();
                });

            }

            it('should load messages for selected random conversation', () => {
                cy.get('.contacts-list .menu-wrapper .recent').click();
                cy.wait(500);
                const i = Math.ceil(Math.random() * 10) + 5;
                cy.get(`.contacts-list .contact:nth-child(${i})`)
                    .click({ force: true });
                cy.get('.messages-list .messages-container .message')
                    .should(checkMessages);
            });

            it(
                'should load messages for selected favourite conversation',
                () => {
                    params.closeMessages();
                    cy.get('.contacts-list .menu-wrapper .all').click();
                    cy.get('.contacts-list .contact:first')
                        .click({ force: true });
                    cy.get('.messages-list .messages-container .message')
                        .should(checkMessages);
                },
            );

            it('loads messages on scroll top', () => {
                params.closeMessages();
                cy.get('.contacts-list .menu-wrapper .recent').click();
                cy.get('.contacts-list .contact:first').click({ force: true });
                if (params.name === MOBILE_PAGE_NAME) {
                    cy.wait(2000);
                    cy.scrollTo('top');
                } else {
                    cy.wait(1000);
                    cy.get('.messages-list .content-wrapper .content')
                        .trigger('ps-y-reach-start');
                }
                cy.get('.messages-list .messages-container .message')
                    .should((messages) =>
                        checkMessages(messages, messagesCount * 2));
            });

            it('translates message on translate message action', () => {
                cy.get('.messages-list .messages-container .message \
                .msg-actions > .translate-button:last \
            ').click();
                cy.get('.message-menu .confirm').click();
                cy.get('.message-menu .translate-status-text');
                params.closeMessageMenu();
            });

            it('sends text message with translation', () => {
                const messageText = Math.random().toString();
                cy.get('.editable-content-container.send-message-container \
                .editable-content[contenteditable=true]\
            ').click({ force: true }).focus().type(messageText);
                cy.get('.editable-content-container.send-message-container \
                .btns .translate-input [type=checkbox]\
            ').check({ force: true });
                cy.get('.editable-content-container.send-message-container \
                .btns .send \
            ').click();
                cy.get('.message-menu .confirm').click();
                cy.get('.messages-list .messages-container .message:last \
                .msg-text:last \
            ').should('have.text', messageText);
            });

            it('sends text message without translation', () => {
                const messageText = Math.random().toString();
                cy.get('.editable-content-container.send-message-container \
                    .editable-content[contenteditable=true]\
                ').click({ force: true }).focus().type(messageText);
                cy.get('.editable-content-container.send-message-container \
                    .btns .translate-input [type=checkbox]\
                ').uncheck({ force: true });
                cy.get('.editable-content-container.send-message-container \
                    .btns .send \
                ').click({ force: true });
                cy.get('.messages-list .messages-container .message:last \
                    .msg-text:last \
                ', { timeout: 6000 }).should('have.text', messageText);
            });

            if ([PAGE_NAME, SIDEBAR_NAME].indexOf(params.name) !== -1) {

                describe('emoji panel', () => {

                    let inputContent = '';

                    it('should be visible', () => {
                        // eslint-disable-next-line max-len
                        cy.get('.editable-content-container.send-message-container \
                            .editable-content[contenteditable=true]\
                        ').click({ force: true }).focus();
                        // eslint-disable-next-line max-len
                        cy.get('.editable-content-container.send-message-container \
                            .btns .smile-button \
                        ').click();
                        // eslint-disable-next-line max-len
                        cy.get('.editable-content-container.send-message-container \
                            .emoji-panel \
                        ').should('be.visible');
                    });

                    it('picks emoji', () => {
                        const initialInputContent = Cypress.$('\
                            .editable-content-container.send-message-container \
                            .editable-content[contenteditable=true]\
                        ').text();
                        cy.get('.vue-recycle-scroller__item-view:nth-child(2) \
                            .emoji-mart-emoji:first \
                        ').click({ force: true });
                        cy.get('.editable-content-container' +
                            '.send-message-container \
                            .editable-content[contenteditable=true]\
                        ').then((input) => {
                            inputContent = input.text();
                            expect(inputContent)
                                .to.be.not.eq(initialInputContent);
                        });
                    });

                    it('sends message with emoji', () => {
                        cy.get('.editable-content-container' +
                            '.send-message-container \
                            .btns .translate-input [type=checkbox]\
                        ').uncheck({ force: true });
                        cy.get('.editable-content-container' +
                            '.send-message-container \
                            .btns .send \
                        ').click({ force: true });
                        cy.get('.messages-list .messages-container \
                            .message:last \
                            .msg-text:last \
                        ').then((msg) => {
                            expect(msg.text()).to.be.eq(inputContent);
                        });
                    });

                });

            }

            describe('message menu', () => {

                it('translates message', () => {
                    cy.get('.messages-list .messages-container \
                    .message .msg.translatable:last .swipe-helper > .icon \
                ').click({ force: true });
                    cy.get('.message-menu .actions .translate-button').click();
                    cy.get('.message-menu .confirm').click();
                    cy.get('.message-menu .translate-status-text');
                    params.closeMessageMenu();
                });

                it('resends message', () => {
                    cy.wait(500);
                    cy.get('.messages-list .messages-container \
                    .message .msg.transferable:last .swipe-helper > .icon \
                ').click({ force: true });
                    cy.get('.message-menu .actions .send-on-button').click();
                    cy.get('.message-menu .confirm').click();
                    cy.get(`.send-file-menu .contacts-to-send \
                    .contact:nth-child(${caseIndex + 2}) \
                    .checkbox [type=checkbox] \
                `).check({ force: true });
                    cy.get('.send-file-menu .actions .confirm').click();
                    params.closeMessageMenu();
                    params.closeMessages();
                    cy.get('.contacts-list .menu-wrapper .recent').click();
                    cy.get(
                        `.contacts-list .contact:nth-child(${caseIndex + 2})`,
                    ).click({ force: true });
                    cy.get('.messages-list .message:not(.status):last \
                    .send-on-message-header \
                ');
                });

                it('deletes and restores message', () => {
                    cy.wait(500);
                    params.closeMessages();
                    cy.get('.contacts-list .menu-wrapper .recent').click();
                    cy.get(
                        `.contacts-list .contact:nth-child(${caseIndex + 3})`,
                    ).click({ force: true });
                    cy.get('.messages-list .messages-container \
                    .message .msg.deletable:last .swipe-helper > .icon \
                ').click({ force: true });
                    cy.get('.message-menu .actions .remove-button').click();
                    cy.get(
                        '.messages-list .messages-container .message-removed',
                    );
                    cy.wait(1000);
                    cy.get('.messages-list .messages-container \
                    .message-removed > \
                    .restore \
                ').click();
                    cy.get('.messages-list .messages-container .message')
                        .should((messages) => {
                            expect(
                                messages.find('.msg .message-removed').length,
                            ).to.be.eq(0);
                        });
                });

                it('clears and restores conversation messages', () => {
                    cy.wait(500);
                    cy.get('.messages-list .messages-container \
                    .message .msg .swipe-helper > .icon:last \
                ').click({ force: true });
                    cy.get('.message-menu .actions \
                        .clear-conversation-button:last').click();
                    cy.get('.messages-list .messages-container .message')
                        .should((messages) => checkMessages(messages, 0));
                    cy.wait(1000);
                    cy.get('.messages-list .messages-container \
                    .messages-removed > .restore \
                ').click();
                    cy.get('.messages-list .messages-container .message')
                        .should((messages) => {
                            const separateMessages: HTMLElement[] = [];
                            messages.not('.status').find('.msg').each(
                                (i, msg) => {
                                    separateMessages.push(msg);
                                });
                            expect(separateMessages.length).to.be.at.least(
                                messagesCount,
                            );
                        });
                });

            });

        });


    });
}
