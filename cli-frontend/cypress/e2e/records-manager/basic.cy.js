describe('Records Manager E2E Tests', () => {
  beforeEach(() => {
    // Visit the Records Manager application
    cy.visit('/')
    
    // Verify we're on the Records Manager page
    cy.get('h1').should('contain', 'Records Manager')
      .and('have.css', 'color', 'rgb(100, 108, 255)') // #646cff
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

    it('should have correct dark mode styling', () => {
      // Verify dark background
      cy.get('body').should('have.css', 'background-color', 'rgb(26, 26, 26)') // #1a1a1a
      
      // Verify form styling
      cy.get('form').should('have.css', 'background-color', 'rgb(42, 42, 42)') // #2a2a2a
      
      // Verify input styling
      cy.get('input').first()
        .should('have.css', 'background-color', 'rgb(51, 51, 51)') // #333
        .and('have.css', 'color', 'rgb(255, 255, 255)') // white
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
        .should('have.css', 'color', 'rgb(136, 136, 136)') // #888
    })

    it('should refresh the records list', () => {
      // Click refresh and verify no errors
      cy.get('button').contains('Refresh List').click()
      
      // Verify existing records are still visible
      cy.get('li').should('exist')
        .and('have.css', 'background-color', 'rgb(42, 42, 42)') // #2a2a2a
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

  describe('Visual Styling', () => {
    it('should display records with correct styling', () => {
      // Verify the accent colored record names
      cy.get('li strong').should('have.css', 'color', 'rgb(100, 108, 255)') // #646cff
      
      // Verify the timestamp styling
      cy.contains('Created:')
        .parent()
        .should('have.css', 'color', 'rgba(255, 255, 255, 0.87)')
    })
  })
})