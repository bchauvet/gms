describe('Home Page', () => {
  beforeEach(() => {
    // Mock authentication using custom command
    cy.mockAuthenticatedUser();

    // Visit the home page
    cy.visit('/');
    cy.wait('@getUser');
  });

  it('should display the home page when authenticated', () => {
    // Verify we're on the home page
    cy.url().should('include', '/');

    // Check for home page elements
    cy.get('h1').contains('Welcome').should('be.visible');

    // Check for main layout elements
    cy.get('header').should('be.visible');
    cy.get('footer').should('be.visible');
  });

  it('should have navigation to other pages', () => {
    // Check for navigation links
    cy.get('a[href="/profile"]').should('be.visible');
    cy.get('a[href="/roster"]').should('be.visible');
  });
});
