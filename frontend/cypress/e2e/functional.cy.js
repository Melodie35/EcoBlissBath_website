describe('connexion', () => {

    beforeEach(() => {
        cy.visit('http://localhost:4200/#/')
        cy.getBySel('nav-link-login').click()
    })

    it('gets the connexion form', () => {
        cy.getBySel('login-input-username').should('be.visible')
        cy.getBySel('login-input-password').should('be.visible')
        cy.getBySel('login-submit').should('be.visible')
    })

    it('should be connected', () => {
        cy.getBySel('login-input-username').type('test2@test.fr')
        cy.getBySel('login-input-password').type('testtest')
        cy.getBySel('login-submit').click()
        cy.getBySel('nav-link-cart').should('be.visible')
        cy.getBySel('nav-link-logout').should('be.visible')

    })
})