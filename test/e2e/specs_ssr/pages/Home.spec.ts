describe('Home page', () => {


    it('should has correct status code', () => {
        cy.request('/').then((res) => {
            expect(res.status).to.eq(200);
        });
    });


    describe('meta info', () => {

        before(() => {
            cy.visit('/');
        });

        it('should has correct keywords', () => {
            cy.get('meta[name=keywords]')
                .should('have.attr', 'content');
        });

        it('should has correct description', () => {
            cy.get('meta[name=description]')
                .should('have.attr', 'content');
        });

    });


});
