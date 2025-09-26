// définition de l'environnement
const apiUrl = Cypress.env('apiUrl')

//Vérifier la présence des champs et boutons de connexion
describe('connexion page', () => {

    beforeEach(() => {
        cy.visit('/login')
    })

    it('checks presence of Email field', () => {
        cy.getBySel('login-input-username')
            .should('be.visible')
            .should('have.attr', 'type', 'text')      
    })

    it('checks presence of Password field', () => {
        cy.getBySel('login-input-password')
            .should('be.visible')
            .should('have.attr', 'type', 'password') 
    })

    it('checks presence of active Connexion button', () => {
        cy.getBySel('login-submit')
            .should('be.visible')
            .should('contain', 'Se connecter')
            .should('be.enabled')
    })
})


//Vérifier la présence des boutons d’ajout au panier quand vous êtes connecté
describe('add to cart button after connexion', () => {

    beforeEach(() => {
        cy.login()
        cy.intercept('GET', apiUrl + '/products').as('getProducts')  
    })

    it('checks presence of active Add to cart button', () => {
        cy.visit('/products')
        cy.wait('@getProducts').then(() => {
            cy.getBySel('product-link').eq(0).click()
        })

        cy.getBySel('detail-product-add')
            .should('be.visible')
            .and('have.text', 'Ajouter au panier')
            .should('be.enabled')
        
    })

})

