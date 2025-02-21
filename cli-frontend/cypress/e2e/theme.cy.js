describe('Theme System', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('defaults to dark theme', () => {
    cy.get('div.theme-dark').should('exist')
    cy.get('div.theme-light').should('not.exist')
  })

  it('toggles theme when button is clicked', () => {
    // Initial state check
    cy.get('div.theme-dark').should('exist')
    
    // Click toggle and verify light theme
    cy.get('button.theme-toggle').click()
    cy.get('div.theme-light').should('exist')
    cy.get('div.theme-dark').should('not.exist')
    
    // Click toggle again and verify dark theme
    cy.get('button.theme-toggle').click()
    cy.get('div.theme-dark').should('exist')
    cy.get('div.theme-light').should('not.exist')
  })

  it('maintains UI functionality across theme changes', () => {
    // Test form in dark theme
    cy.get('.form-field input').first().type('Test Record')
    cy.get('.form-field input').last().type('Test Value')
    
    // Toggle theme
    cy.get('button.theme-toggle').click()
    
    // Verify input values persist
    cy.get('.form-field input').first().should('have.value', 'Test Record')
    cy.get('.form-field input').last().should('have.value', 'Test Value')
    
    // Test form submission in light theme
    cy.get('button[type="submit"]').click()
    
    // Verify record appears in either theme
    cy.get('li strong').should('contain', 'Test Record')
  })

  it('ensures theme toggle is accessible', () => {
    // Check initial aria-label
    cy.get('button.theme-toggle')
      .should('have.attr', 'aria-label', 'Switch to light theme')
    
    // Check aria-label after toggle
    cy.get('button.theme-toggle').click()
    cy.get('button.theme-toggle')
      .should('have.attr', 'aria-label', 'Switch to dark theme')
  })

  it('maintains consistent spacing and layout in both themes', () => {
    // Check form layout in dark theme
    cy.get('form').should('be.visible')
    cy.get('.form-field').should('have.length', 2)
    cy.get('.form-actions').should('be.visible')
    
    // Toggle theme
    cy.get('button.theme-toggle').click()
    
    // Verify same layout in light theme
    cy.get('form').should('be.visible')
    cy.get('.form-field').should('have.length', 2)
    cy.get('.form-actions').should('be.visible')
  })

  // Add visual test for critical UI elements
  it('ensures critical UI elements are visible in both themes', () => {
    // Dark theme checks
    cy.get('h1').should('be.visible')
    cy.get('form').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
    
    // Toggle to light theme
    cy.get('button.theme-toggle').click()
    
    // Light theme checks
    cy.get('h1').should('be.visible')
    cy.get('form').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })
})