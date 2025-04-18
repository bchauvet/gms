describe('Login Page', () => {
  it('should visit the login page', () => {
    cy.visit('/oauth/');
    cy.contains('Login').should('be.visible');
  });

  it('should have a Battle.net login button', () => {
    cy.visit('/oauth/');
    cy.get('button').contains('Login with Battle.net').should('be.visible');
  });
});
