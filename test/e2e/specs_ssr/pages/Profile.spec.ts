describe('Profile page', () => {


    it('should has correct status code', () => {
        cy.request('/u/1').then((res) => {
            expect(res.status).to.eq(200);
        });
    });


});
