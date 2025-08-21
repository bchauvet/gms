# Cypress Tests for RMS Frontend

This directory contains end-to-end tests for the RMS Frontend application using Cypress.

## Test Structure

The tests are organized by routes:

- `login.cy.ts` - Tests for the login page
- `bnet-callback.cy.ts` - Tests for the Battle.net OAuth callback
- `home.cy.ts` - Tests for the home page
- `profile.cy.ts` - Tests for the profile page
- `roster.cy.ts` - Tests for the roster page
- `error-not-found.cy.ts` - Tests for the 404 error page
- `auth-redirects.cy.ts` - Tests for authentication redirects

## Running Tests

To run the tests, you need to have the frontend development server running:

```bash
# Start the development server
npm run dev
```

Then, in a separate terminal, you can run the tests in one of two ways:

### Headless Mode

```bash
# Run all tests in headless mode
npm test
```

### Interactive Mode

```bash
# Open Cypress GUI for interactive testing
npm run test:open
```

## Custom Commands

The tests use custom Cypress commands to simplify common operations:

- `cy.mockAuthenticatedUser()` - Mocks an authenticated user
- `cy.mockUnauthenticatedUser()` - Mocks an unauthenticated user

These commands are defined in `cypress/support/commands.ts`.

## Configuration

The Cypress configuration is in `cypress.config.ts` at the root of the project. Key settings:

- `baseUrl` - Set to `http://localhost:9000` (update if your dev server uses a different port)
- `viewportWidth` and `viewportHeight` - Set the browser viewport size
- `video` - Disabled for faster tests
- `screenshotOnRunFailure` - Enabled to capture screenshots on test failures
