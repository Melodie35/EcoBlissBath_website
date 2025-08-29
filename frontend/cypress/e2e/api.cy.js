// définition de l'environnement
const apiUrl = Cypress.env('apiUrl') 


//GET

//Requête sur les données confidentielles d'un utilisateur avant connexion --> erreur
describe('cart access without connexion', () => {
    it('should return an error', () => {
        cy.request({
                method: 'GET',
                url: apiUrl + '/orders',
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(401)
            })   
    })
})

//Requête de la liste des produits du panier
describe('cart access when connected', () => {
    let token

    before(() => {
        cy.fixture('users').then((user) => {
            cy.request({
                method: 'POST',
                url: apiUrl + '/login',
                body: user.utilisateurConnu
            }).then((response => {
                token = response.body.token
            }))
        })        
    })
    
    it('should return the product list of the cart', () => {
        cy.request({
            method: 'GET',
            url: apiUrl + '/orders',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.orderLines).to.be.an('array')                
        })   
    })
})

//Requête d’une fiche produit spécifique
describe('specific product', () => {
    it('should return the product details and its id', () => {
        cy.request({
            method: 'GET',
            url: apiUrl + '/products/3'
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.id).to.eq(3)
            expect(response.body).to.have.keys('id', 'name','availableStock', 'skin', 'aromas', 'ingredients', 'description', 'price', 'picture', 'varieties')
        })
    })
})

/********************************************************/
//POST

//Vérifier le login via http://localhost:8081/login
describe('http://localhost:8081/login', () => {
    beforeEach(() => {
        cy.fixture('users').as('users')
    })

    it('should return error 401 with unknown user', function () {
        const user = this.users.utilisateurInconnu

        cy.request({
                method: 'POST',
                url: apiUrl + '/login',
                body: user,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(401)
                expect(response.body).to.deep.include({ message: "Invalid credentials." })
            })        
    })

    it('should return 200 with known user', function () {
        const user = this.users.utilisateurConnu

        cy.request({
                method: 'POST',
                url: apiUrl + '/login',
                body: user
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('token')
            })        
    })
})

//Ajouter un produit au panier
describe('http://localhost:8081/orders/add', () => {
    let token

    beforeEach(() => {
        cy.fixture('users').then((user) => {
            cy.request({
                method: 'POST',
                url: apiUrl + '/login',
                body: user.utilisateurConnu
            }).then((response => {
                token = response.body.token
            }))
        })
        
        cy.fixture('products').as('products')
    })

    //un produit disponible
    it('should add a product available', function () {
        const product = this.products.disponible

        cy.request({
            method: 'POST',
            url: apiUrl + '/orders/add',
            body: product,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.orderLines).to.be.an('array')                
        })
    })

    //un produit en rupture de stock
    it('should not add a product unavailable', function () {
        const product = this.products.rupture

        cy.request({
            method: 'POST',
            url: apiUrl + '/orders/add',
            body: product,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            expect(response.status).to.not.eq(200)               
        })
    })
})


//Ajouter un avis
// describe('http://localhost:8081/reviews', () => {
//     let token

//     before(() => {
//         cy.fixture('users').then((user) => {
//             cy.request({
//                 method: 'POST',
//                 url: apiUrl + '/login',
//                 body: user.utilisateurConnu
//             }).then((response => {
//                 token = response.body.token
//             }))
//         })
//     })

    // it('should add a review', () => {
    //      cy.request({
    //         method: 'POST',
    //         url: apiUrl + '/reviews',
    //         body: {
    //             "title": "Test",
    //             "comment": "Test sur Cypress",
    //             "rating": 4
    //         },
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     }).then((response) => {
    //         expect(response.status).to.eq(200)
    //         expect(response.body).to.have.property('author')                
    //     })
    // })
// })

