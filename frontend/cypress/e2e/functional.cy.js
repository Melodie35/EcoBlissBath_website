//Connexion
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
        cy.wait('@getProduct').then((intercept) => {
            let stock = intercept.response.body.availableStock
            console.log(stock)

            cy.intercept('PUT', 'http://localhost:8081/orders/add').as('addCart')
            cy.getBySel('detail-product-add').click()
            if (stock > 1){
                cy.wait('@addCart').its('response.statusCode').should('eq', 200)
            } else {
                cy.wait(1000).then(() => {
                    cy.get('@addCart.all').should('have.length', 0)
                })
            }
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

            cy.intercept('PUT', 'http://localhost:8081/orders/add').as('addCart')
            cy.getBySel('detail-product-add').click()
            cy.wait(1000).then(() => {
                    cy.get('@addCart.all').should('have.length', 0)
                })
            
        }) 
    })

    //vérifiez les limites : entrez un chiffre supérieur à 20 en quantité à ajouter
    it('tries to add a product over than 20 ', () => {
        cy.wait('@getProduct').then(() => {
            cy.getBySel('detail-product-quantity')
                .clear()
                .type('21')

            cy.intercept('PUT', 'http://localhost:8081/orders/add').as('addCart')
            cy.getBySel('detail-product-add').click()
            cy.wait(1000).then(() => {
                    cy.get('@addCart.all').should('have.length', 0)
                })
        }) 
    })


    // vérification du contenu du panier via l’API
    it('checks cart content after adding a product', () => {
        cy.intercept('PUT', 'http://localhost:8081/orders/add').as('addCart')
        cy.intercept('GET', 'http://localhost:8081/orders').as('getOrders')

        cy.wait('@getProduct').then(() => {
            cy.getBySel('detail-product-add').click()
        })

        cy.wait('@addCart').then((intercept) => {
            cy.getBySel('cart-line').should('have.length.greaterThan', 0)
            expect(intercept.response.statusCode).to.eq(200)
            expect(intercept.response.body.orderLines).to.exist
            expect(intercept.response.body.orderLines[0].product).to.deep.include({ id: 3, name: "Sentiments printaniers", description: "Savon avec une formule douce à base d’huile de framboise, de citron et de menthe qui nettoie les mains efficacement sans les dessécher.", price: 60 })
            expect(intercept.request.body).to.deep.include({ product: 3 })
            })
        
        cy.wait('@getOrders').its('response.statusCode').should('eq', 200)

    })

    // Vérifiez la présence du champ de disponibilité du produit
    it('checks the Stock field of the product', () => {
        cy.wait('@getProduct').then(() => {
            cy.getBySel('detail-product-stock').should('have.length.greaterThan', 0)
        })
    })

})
