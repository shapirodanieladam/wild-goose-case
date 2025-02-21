describe('Records Manager E2E Tests', () => {
  beforeEach(() => {
    // Visit the Records Manager application
    cy.visit('/')
    
    // Verify we're on the Records Manager page
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
      // Using the records we saw in the screenshot as test data
      cy.contains('hello').should('exist')
      cy.contains('world').should('exist')
    })

    it('should handle empty inputs gracefully', () => {
      // Try to add record without input
      cy.get('button').contains('Add Record').click()
      
      // Add assertions for your error handling behavior
      // This might need to be adjusted based on how your app handles this case
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

  describe('API Integration', () => {
    it('should handle API errors gracefully', () => {
      // This test requires the ability to simulate API failures
      // We might need to use cy.intercept() to mock API failures
      cy.intercept('POST', '/api/records', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('addRecordError')

      // Try to add a record
      cy.get('input[placeholder="Enter record name"]').type('error-test')
      cy.get('input[placeholder="Enter record value"]').type('should-fail')
      cy.get('button').contains('Add Record').click()

      // Wait for the API call and verify error handling
      cy.wait('@addRecordError')
      
      // Add assertions for your error handling UI
      // This might need to be adjusted based on how your app handles errors
    })
  })

  describe('Visual Styling', () => {
    it('should display records with correct styling', () => {
      // Verify the teal colored record names
      cy.contains('hello').should('have.css', 'color', 'rgb(13, 148, 136)')
      
      // Verify the timestamp styling
      cy.contains('Created:').should('exist')
        .parent()
        .should('have.css', 'color', 'rgb(31, 41, 55)') // Dark gray text
    })
  })
})