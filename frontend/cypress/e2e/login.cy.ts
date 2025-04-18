describe('Login Page', () => {
  it('should visit the login page', () => {
    cy.visit('/auth/');
    cy.contains('Login').should('be.visible');
  });

  it('should have a Battle.net login button', () => {
    cy.visit('/auth/');
    cy.get('button').contains('Login with Battle.net').should('be.visible');
  });
});
