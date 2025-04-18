describe('Profile Page', () => {
  beforeEach(() => {
    // Mock authentication using custom command
    cy.mockAuthenticatedUser();

    // Mock profile data if needed
    cy.intercept('GET', '**/profile', {
      statusCode: 200,
      body: {
        characters: [
          {
            name: 'TestCharacter',
            realm: 'TestRealm',
            class: 'Warrior',
            level: 60
          }
        ]
      }
    }).as('getProfile');

    // Visit the profile page
    cy.visit('/profile');
    cy.wait('@getUser');
  });

  it('should display the profile page when authenticated', () => {
    // Verify we're on the profile page
    cy.url().should('include', '/profile');

    // Check for profile page elements
    cy.contains('Profile').should('be.visible');
    cy.contains('TestUser#1234').should('be.visible');
  });

  it('should display user characters if available', () => {
    cy.wait('@getProfile');

    // Check for character information
    cy.contains('TestCharacter').should('be.visible');
    cy.contains('TestRealm').should('be.visible');
    cy.contains('Warrior').should('be.visible');
  });

  it('should have navigation back to home', () => {
    // Check for navigation links
    cy.get('a[href="/"]').should('be.visible');
  });
});
