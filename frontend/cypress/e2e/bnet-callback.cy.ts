describe('Battle.net Callback', () => {
  it('should handle Battle.net callback', () => {
    // Mock the OAuth callback response
    cy.intercept('GET', '/oauth/bnet*', {
      statusCode: 200,
      body: {
        // Mock response data
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600
      }
    }).as('oauthCallback');

    // Visit the callback URL with mock code
    cy.visit('/oauth/bnet?code=mock-auth-code&state=mock-state');

    // Wait for the callback to be processed
    cy.wait('@oauthCallback');

    // After successful authentication, user should be redirected to home
    cy.url().should('include', '/');
  });

  it('should handle error in callback', () => {
    // Visit the callback URL with error
    cy.visit('/oauth/bnet?error=access_denied&error_description=User+denied+access');

    // Should show error message
    cy.contains('Authentication Error').should('be.visible');
  });
});
