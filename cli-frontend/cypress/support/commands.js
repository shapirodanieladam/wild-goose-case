// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

const storedValues = {}

Cypress.Commands.add('preserveLocalStorage', () => {
  Cypress.on('window:before:load', (win) => {
    // Restore all items from storage
    Object.keys(storedValues).forEach(key => {
      win.localStorage.setItem(key, storedValues[key])
    })
  })
})

Cypress.Commands.add('setLocalStorage', (key, value) => {
  cy.window().then((win) => {
    win.localStorage.setItem(key, value)
    storedValues[key] = value
  })
})

Cypress.Commands.add('getLocalStorage', (key) => {
  cy.window().then((win) => {
    return win.localStorage.getItem(key)
  })
})

beforeEach(() => {
  cy.preserveLocalStorage()
})