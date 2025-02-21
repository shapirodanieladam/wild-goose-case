describe('Records Manager E2E Tests', () => {
  beforeEach(() => {
    // Clear localStorage and set initial theme
    cy.window().then((win) => {
      win.localStorage.clear()
    })
    cy.visit('/')
    cy.get('h1').should('contain', 'Records Manager')
  })

  describe('UI Elements', () => {
    it('should display all required form elements', () => {
      // Check form inputs exist
      cy.get('input[placeholder="Enter record name"]').should('exist')
      cy.get('input[placeholder="Enter record value"]').should('exist')
      
      // Check buttons exist
      cy.get('button').contains('Add Record').should('exist')
      cy.get('button').contains('Refresh List').should('exist')
    })

    it('should have appropriate theme styling', () => {
      // Verify theme class is present on root element
      cy.get('div.theme-dark').should('exist')
      cy.get('div.theme-light').should('not.exist')
      
      // Verify theme toggle exists and is accessible
      cy.get('button.theme-toggle')
        .should('exist')
        .and('have.attr', 'aria-label', 'Switch to light theme')
      
      // Toggle theme and verify changes
      cy.get('button.theme-toggle').click()
      cy.get('div.theme-light').should('exist')
      cy.get('div.theme-dark').should('not.exist')
      cy.get('button.theme-toggle')
        .should('have.attr', 'aria-label', 'Switch to dark theme')
        
      // Return to dark theme
      cy.get('button.theme-toggle').click()
      cy.get('div.theme-dark').should('exist')
      cy.get('div.theme-light').should('not.exist')
    })
  })

  describe('Record Management', () => {
    it('should create a new record', () => {
      const testName = 'test-record'
      const testValue = 'test-value'

      // Add a new record
      cy.get('input[placeholder="Enter record name"]').type(testName)
      cy.get('input[placeholder="Enter record value"]').type(testValue)
      cy.get('button').contains('Add Record').click()

      // Verify the record appears in the list
      cy.contains(testName).should('exist')
      cy.contains(testValue).should('exist')
      
      // Verify the creation timestamp is present
      cy.contains('Created:').should('exist')
    })

    it('should refresh the records list', () => {
      // Click refresh and verify no errors
      cy.get('button').contains('Refresh List').click()
      
      // Verify existing records are still visible
      cy.get('li').should('exist')
    })

    it('should handle empty inputs gracefully', () => {
      // Try to add record without input
      cy.get('button').contains('Add Record').click()
      
      // Add assertions for your error handling behavior
      cy.get('input[placeholder="Enter record name"]')
        .should('have.value', '')
        .and('be.visible')
    })
  })

  describe('Data Persistence', () => {
    it('should persist records across page refreshes', () => {
      const testName = 'persistence-test'
      const testValue = 'should-persist'

      // Create a new record
      cy.get('input[placeholder="Enter record name"]').type(testName)
      cy.get('input[placeholder="Enter record value"]').type(testValue)
      cy.get('button').contains('Add Record').click()

      // Refresh the page
      cy.reload()

      // Verify the record still exists
      cy.contains(testName).should('exist')
      cy.contains(testValue).should('exist')
    })
  })

  describe('Theme Persistence', () => {
    it('should maintain theme selection across interactions', () => {
      // Set initial theme to light via localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('app-theme', 'light')
        cy.reload()
      })

      // Verify light theme is active
      cy.get('div.theme-light').should('exist')
      cy.get('div.theme-dark').should('not.exist')
      
      // Add a record
      cy.get('input[placeholder="Enter record name"]').type('theme-test')
      cy.get('input[placeholder="Enter record value"]').type('test-value')
      cy.get('button').contains('Add Record').click()
      
      // Verify theme persists after interaction
      cy.get('div.theme-light').should('exist')
      cy.get('div.theme-dark').should('not.exist')
      
      // Verify localStorage has the correct value
      cy.window().then((win) => {
        const theme = win.localStorage.getItem('app-theme')
        expect(theme).to.eq('light')
      })
      
      // Reload the page
      cy.reload()
      
      // Verify theme persists after reload
      cy.get('div.theme-light').should('exist')
      cy.get('div.theme-dark').should('not.exist')
      
      // Switch back to dark theme
      cy.get('button.theme-toggle').click()
      cy.get('div.theme-dark').should('exist')
      cy.get('div.theme-light').should('not.exist')
      
      // Verify localStorage was updated
      cy.window().then((win) => {
        expect(win.localStorage.getItem('app-theme')).to.eq('dark')
      })
    })
  })

  describe('Theme-based UI Elements', () => {
    it('should maintain proper structure in both themes', () => {
      // Check structure in dark theme
      cy.get('div.theme-dark').within(() => {
        cy.get('form').should('be.visible')
        cy.get('input').should('have.length.at.least', 2)
        cy.get('button').should('have.length.at.least', 2)
      })
      
      // Switch to light theme
      cy.get('button.theme-toggle').click()
      
      // Check same structure in light theme
      cy.get('div.theme-light').within(() => {
        cy.get('form').should('be.visible')
        cy.get('input').should('have.length.at.least', 2)
        cy.get('button').should('have.length.at.least', 2)
      })
    })
  })
})