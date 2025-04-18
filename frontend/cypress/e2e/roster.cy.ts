describe('Roster Page', () => {
  beforeEach(() => {
    // Mock authentication using custom command
    cy.mockAuthenticatedUser();

    // Mock roster data
    cy.intercept('GET', '**/roster', {
      statusCode: 200,
      body: {
        guild: {
          name: 'Test Guild',
          realm: 'Test Realm',
          faction: 'Alliance'
        },
        members: [
          {
            name: 'Member1',
            class: 'Warrior',
            role: 'Tank',
            rank: 'Officer'
          },
          {
            name: 'Member2',
            class: 'Priest',
            role: 'Healer',
            rank: 'Member'
          }
        ]
      }
    }).as('getRoster');

    // Visit the roster page
    cy.visit('/roster');
    cy.wait('@getUser');
  });

  it('should display the roster page when authenticated', () => {
    // Verify we're on the roster page
    cy.url().should('include', '/roster');

    // Check for roster page title
    cy.contains('Roster Overview').should('be.visible');
  });

  it('should display guild information', () => {
    cy.wait('@getRoster');

    // Check for guild information
    cy.contains('Test Guild').should('be.visible');
    cy.contains('Test Realm').should('be.visible');
    cy.contains('Alliance').should('be.visible');
  });

  it('should display roster members', () => {
    cy.wait('@getRoster');

    // Check for member information
    cy.contains('Member1').should('be.visible');
    cy.contains('Warrior').should('be.visible');
    cy.contains('Tank').should('be.visible');
    cy.contains('Officer').should('be.visible');

    cy.contains('Member2').should('be.visible');
    cy.contains('Priest').should('be.visible');
    cy.contains('Healer').should('be.visible');
    cy.contains('Member').should('be.visible');
  });

  it('should have navigation back to home', () => {
    // Check for navigation links
    cy.get('a[href="/"]').should('be.visible');
  });
});
