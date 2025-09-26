import apiRoutes from '../support/apiRoutes'

//GET

//Requête sur les données confidentielles d'un utilisateur avant connexion --> erreur
describe('cart access without connexion', () => {
    it('should return an error', () => {
        cy.request({
                method: 'GET',
                url: apiRoutes.orders,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(401)
            })   
    })
})

//Requête de la liste des produits du panier
describe('cart access when connected', () => {
    before(() => {
        cy.loginAPI() 
    })
    
    it('should return the product list of the cart', () => {        
        cy.authRequest({
            method: 'GET',
            url: apiRoutes.orders
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
            url: apiRoutes.product(3)
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.id).to.eq(3)
            expect(response.body).to.have.keys(
                'id',
                'name',
                'availableStock', 
                'skin', 
                'aromas', 
                'ingredients', 
                'description', 
                'price', 
                'picture', 
                'varieties'
            )
        })
    })
})

/********************************************************/
//POST

//Vérifier le login via http://localhost:8081/login
describe('http://localhost:8081/login', () => {
    
    it('should return error 401 with unknown user', () => {
        cy.loginAPI('utilisateurInconnu', false)
            .then((response) => {
                expect(response.status).to.eq(401)
                expect(response.body).to.deep.include({ message: "Invalid credentials." })
            })        
    })

    it('should return 200 with known user', function () {
        cy.loginAPI()
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('token')
            })        
    })
})

//Ajouter un produit au panier
describe('http://localhost:8081/orders/add', () => {

    beforeEach(() => {
        cy.loginAPI()
        cy.fixture('products').as('products')
    })

    //un produit disponible
    it('should add a product available', function () {
        const product = this.products.disponible

        cy.authRequest({
            method: 'POST',
            url: apiRoutes.addOrder,
            body: product
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.orderLines).to.be.an('array')                
        })
    })

    //un produit en rupture de stock
    it('should not add a product unavailable', function () {
        const product = this.products.rupture

        cy.authRequest({
            method: 'POST',
            url: apiRoutes.addOrder,
            body: product
        }).then((response) => {
            expect(response.status).to.not.eq(200)               
        })
    })
})


//Ajouter un avis
describe('http://localhost:8081/reviews', () => {

    before(() => {
        cy.loginAPI()
    })

    it('should add a review', () => {
        const timestamp = Date.now()

         cy.authRequest({
            method: 'POST',
            url: apiRoutes.reviews,
            body: {
                "title": "Test",
                "comment": `test Cypress ${timestamp}`,
                "rating": 4
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('title', 'Test')
            expect(response.body).to.have.property('rating', 4)
            expect(response.body.comment).to.eq(`test Cypress ${timestamp}`)
        })
    })
})

