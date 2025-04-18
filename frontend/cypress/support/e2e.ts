// ***********************************************************
// This file is processed and loaded automatically before your test files.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Configure Cypress
Cypress.config('baseUrl', 'http://localhost:9000');

// Prevent TypeScript errors when accessing the Cypress namespace
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to mock authenticated user
       * @example cy.mockAuthenticatedUser()
       */
      mockAuthenticatedUser(): Chainable<Element>;

      /**
       * Custom command to mock unauthenticated user
       * @example cy.mockUnauthenticatedUser()
       */
      mockUnauthenticatedUser(): Chainable<Element>;
    }
  }
}
