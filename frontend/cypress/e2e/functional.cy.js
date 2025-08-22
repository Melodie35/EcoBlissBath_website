//Connexion
// describe('connexion', () => {

//     beforeEach(() => {
//         cy.visit('http://localhost:4200/#/')
//         cy.getBySel('nav-link-login').click()
//     })

//     it('gets the connexion form', () => {
//         cy.getBySel('login-input-username').should('be.visible')
//         cy.getBySel('login-input-password').should('be.visible')
//         cy.getBySel('login-submit').should('be.visible')
//     })

//     it('should be connected', () => {
//         cy.getBySel('login-input-username').type('test2@test.fr')
//         cy.getBySel('login-input-password').type('testtest')
//         cy.getBySel('login-submit').click()

//         cy.getBySel('nav-link-cart').should('be.visible')
//         cy.getBySel('nav-link-logout').should('be.visible')

//     })
// })


//Panier
describe('Add to the cart function', () => {

    beforeEach(() => {
        cy.visit('http://localhost:4200/#/')
        cy.getBySel('nav-link-login').click()
        cy.getBySel('login-input-username').type('test2@test.fr')
        cy.getBySel('login-input-password').type('testtest')
        cy.getBySel('login-submit').click()
        cy.getBySel('nav-link-cart').should('have.length.greaterThan', 0)
        cy.intercept('GET', 'http://localhost:8081/products').as('getProducts')
        cy.getBySel('nav-link-products').click()
        cy.intercept('GET', 'http://localhost:8081/products/3').as('getProduct')
        cy.wait('@getProducts').then(() => {
            cy.getBySel('product-link').eq(0).click()
        })
    })

    //le stock doit être supérieur à 1 pour pouvoir être ajouté
    it('checks products stock before adding to cart', () => {
        cy.wait('@getProduct').then(({response}) => {
            const stock = response.body.availableStock
            cy.getBySel('detail-product-add').should(stock > 1 ? 'not.be.disabled' : 'be.disabled')
        })    
    })

    // vérifiez que le produit a été ajouté au panier
    it('checks the product was added to the cart', () => {
        cy.intercept('GET', 'http://localhost:8081/orders').as('getOrders')

        cy.wait('@getProduct').then(() => {
            cy.getBySel('detail-product-add').click()
        })

        cy.wait('@getOrders').then(() => {
            cy.getBySel('cart-line').should('have.length.greaterThan', 0)
            cy.getBySel('cart-line-quantity')
                .invoke('val')
                .then((val) => expect(+val).to.be.at.least(1))
        })
    })

    //vérifiez que le stock a enlevé le nombre de produits qui sont dans le panier
    it('checks the stock after adding a product to the cart', () => {
        let beforeStock = ""
        let addedQuantity = ""
        let afterStock = ""

        cy.intercept('GET', 'http://localhost:8081/orders').as('getOrders')

        cy.wait('@getProduct').then(({response}) => {
            beforeStock = response.body.availableStock
            cy.getBySel('detail-product-quantity')
                .invoke('val')
                .then((val) => addedQuantity = Number(val))
            cy.getBySel('detail-product-add').click()
        })

        cy.wait('@getOrders').then(() => {
            cy.getBySel('nav-link-products').click()
        })
        
        cy.wait('@getProducts').then(() => {
            cy.getBySel('product-link').eq(0).click()
        })

        cy.wait('@getProduct').then(({response}) => {
            afterStock = response.body.availableStock
            expect(afterStock).to.equal(beforeStock-addedQuantity)
        })

    })


    //vérifiez les limites : entrez un chiffre négatif en quantité à ajouter
    it('tries to add a negative quantity of product', () => {
        cy.wait('@getProduct').then(() => {
            cy.getBySel('detail-product-quantity')
                .clear()
                .type('-1')
            cy.getBySel('detail-product-add').should('be.disabled')
        }) 
    })

    //vérifiez les limites : entrez un chiffre supérieur à 20 en quantité à ajouter
    it('tries to add a product over than 20 ', () => {
        cy.wait('@getProduct').then(() => {
            cy.getBySel('detail-product-quantity')
                .clear()
                .type('21')
            cy.getBySel('detail-product-add').should('be.disabled')
        }) 
    })

    // it('checks cart content after adding a product', () => {})

    // Vérifiez la présence du champ de disponibilité du produit
    it('checks the Stock field of the product', () => {
        cy.wait('@getProduct').then(() => {
            cy.getBySel('detail-product-stock').should('have.length.greaterThan', 0)
        })
    })

})
