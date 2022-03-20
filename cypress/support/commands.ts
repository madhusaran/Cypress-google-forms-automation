/**
 * Cypress custom command to retrive excel data
 */
Cypress.Commands.add('parseXl', (inputFile) => {
    return cy.task('parseXlsx', { filePath: inputFile })
});