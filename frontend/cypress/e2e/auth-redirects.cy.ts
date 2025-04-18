describe('Authentication Redirects', () => {
  it('should redirect to login page when not authenticated', () => {
    // Mock unauthenticated user using custom command
    cy.mockUnauthenticatedUser();

    // Try to visit home page
    cy.visit('/');
    cy.wait('@getUser');

    // Should be redirected to login page
    cy.url().should('include', '/oauth/');
  });

  it('should redirect to login page when trying to access profile page without auth', () => {
    // Mock unauthenticated user using custom command
    cy.mockUnauthenticatedUser();

    // Try to visit profile page
    cy.visit('/profile');
    cy.wait('@getUser');

    // Should be redirected to login page
    cy.url().should('include', '/oauth/');
  });

  it('should redirect to login page when trying to access roster page without auth', () => {
    // Mock unauthenticated user using custom command
    cy.mockUnauthenticatedUser();

    // Try to visit roster page
    cy.visit('/roster');
    cy.wait('@getUser');

    // Should be redirected to login page
    cy.url().should('include', '/oauth/');
  });

  it('should not redirect to login page when accessing oauth routes', () => {
    // Mock unauthenticated user using custom command
    cy.mockUnauthenticatedUser();

    // Visit login page
    cy.visit('/oauth/');

    // Should stay on login page
    cy.url().should('include', '/oauth/');
    cy.contains('Login').should('be.visible');
  });

  it('should redirect to home page after successful authentication', () => {
    // First mock unauthenticated to show login page
    cy.mockUnauthenticatedUser();

    cy.visit('/');
    cy.wait('@getUser');
    cy.url().should('include', '/oauth/');

    // Then mock successful authentication
    cy.mockAuthenticatedUser();

    // Simulate successful login (in a real app this would be through OAuth)
    // For testing, we'll just navigate to home and let the intercepted auth work
    cy.visit('/');
    cy.wait('@getUser');

    // Should be on home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
