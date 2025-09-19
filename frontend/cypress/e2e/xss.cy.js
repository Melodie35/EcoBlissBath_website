// définition de l'environnement
const apiUrl = Cypress.env('apiUrl')

//Faille XSS
describe('XSS vulnerability', () => {

    beforeEach(() => {
        cy.visit('/login')
        cy.getBySel('login-input-username').type('test2@test.fr')
        cy.getBySel('login-input-password').type('testtest')
        cy.getBySel('login-submit').click()
        cy.getBySel('nav-link-cart').should('have.length.greaterThan', 0)
        cy.visit('/reviews')
    })

    it('should not contain XSS vunerability in the comment', () => {
        cy.get('[data-cy="review-input-rating-images"] img')
            .eq(3)
            .click()
        const timestamp = Date.now()
        cy.getBySel('review-input-title').type(`test Cypress ${timestamp}`)
        cy.getBySel('review-input-comment').type('<script> location.href = "https://www.google.com"</script>')
        cy.intercept('GET', apiUrl + '/reviews').as('getReviews')
        cy.getBySel('review-submit').click()

        cy.wait('@getReviews').then(() => {
            cy.get('body').should('contain', `test Cypress ${timestamp}`)
            cy.url().should('not.include', 'https://www.google.com')
        })
    })

    it('should not contain XSS vunerability in the title', () => {
        cy.get('[data-cy="review-input-rating-images"] img')
            .eq(3)
            .click()
        const timestamp2 = Date.now()
        cy.getBySel('review-input-title').type('<script> location.href = "https://www.google.com"</script>')
        cy.getBySel('review-input-comment').type(`test Cypress ${timestamp2}`)
        cy.intercept('GET', apiUrl + '/reviews').as('getReviews')
        cy.getBySel('review-submit').click()

        cy.wait('@getReviews').then(() => {
            cy.get('body').should('contain', `test Cypress ${timestamp2}`)
            cy.url().should('not.include', 'https://www.google.com')
        })
    })

})