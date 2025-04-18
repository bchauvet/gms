// ***********************************************
// This file defines custom commands for Cypress.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
Cypress.Commands.add('mockAuthenticatedUser', () => {
  cy.intercept('GET', '**/user', {
    statusCode: 200,
    body: {
      id: '12345',
      battletag: 'TestUser#1234',
      sub: 'mock-sub-id',
      token: 'mock-token'
    }
  }).as('getUser');
});

Cypress.Commands.add('mockUnauthenticatedUser', () => {
  cy.intercept('GET', '**/user', {
    statusCode: 401,
    body: null
  }).as('getUser');
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
