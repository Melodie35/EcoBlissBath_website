//Vérifier la présence des champs et boutons de connexion
describe('connexion page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4200/#/login')
    })

    it('checks presence of Email field', () => {
        cy.getBySel('login-input-username').should('be.visible')        
    })

    it('checks presence of Password field', () => {
        cy.getBySel('login-input-password').should('be.visible')
    })

    it('checks presence of Connexion button', () => {
        cy.getBySel('login-submit').should('be.visible')
    })

    it('checks that Connexion button is active', () => {
        cy.getBySel('login-submit').should('be.enabled')
    })
})


