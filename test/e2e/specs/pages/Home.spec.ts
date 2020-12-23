import Sizes from 'utils/Sizes';


describe('Home page', () => {


    beforeEach(() => {
        cy.visit('/');
    });


    describe('<main> container', () => {

        context('on mobile screen (max. 756px)', () => {

            it('has no horizontal margins', () => {
                cy.viewport(
                    Sizes.screen.mobile.width,
                    Sizes.screen.mobile.height,
                );
                cy.get('main').should('have.css', 'margin-left', '0px');
                cy.get('main').should('have.css', 'margin-right', '0px');
            });

        });

    });


    describe('wrapper', () => {

        context('on big screen sizes', () => {

            it('has max width 1366px', () => {
                cy.viewport(
                    Sizes.screen.desktop.big.width,
                    Sizes.screen.desktop.big.height,
                );
                cy.get('.wrapper')
                    .should('have.css', 'width', `${Sizes.wrapper.width}px`);
            });

        });

    });


});
