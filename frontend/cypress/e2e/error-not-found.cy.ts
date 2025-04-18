describe('Error Not Found Page', () => {
  beforeEach(() => {
    // Mock authentication using custom command
    cy.mockAuthenticatedUser();
  });

  it('should display 404 page for non-existent route', () => {
    // Visit a non-existent route
    cy.visit('/non-existent-route');
    cy.wait('@getUser');

    // Check for 404 page elements
    cy.contains('404').should('be.visible');
    cy.contains('Not Found').should('be.visible');
  });

  it('should have a link back to home page', () => {
    cy.visit('/non-existent-route');
    cy.wait('@getUser');

    // Check for home link
    cy.get('a[href="/"]').should('be.visible');
    cy.contains('Go Home').should('be.visible');
  });

  it('should navigate back to home when clicking the home link', () => {
    cy.visit('/non-existent-route');
    cy.wait('@getUser');

    // Click on home link
    cy.contains('Go Home').click();

    // Should be redirected to home
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
