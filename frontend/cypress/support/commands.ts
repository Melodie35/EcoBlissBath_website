import apiRoutes from './apiRoutes'

/// <reference types="cypress" />



Cypress.Commands.add("getBySel", (selector, ...args) => {
    return cy.get(`[data-cy=${selector}]`, ...args)
})

Cypress.Commands.add("login", () => {
    cy.fixture('users').then((user) => {
        const knownUser = user['utilisateurConnu']

        cy.visit('/login')
        cy.getBySel('login-input-username').type(knownUser.username)
        cy.getBySel('login-input-password').type(knownUser.password)
        cy.getBySel('login-submit').click()
        cy.getBySel('nav-link-cart').should('have.length.greaterThan', 0)
    })
})

Cypress.Commands.add("loginAPI", (userKey = 'utilisateurConnu', failOnError = true) => {
    cy.fixture('users').then((users) => {
        const user = users[userKey]

        if (!user) {
            throw new Error(`Utilisateur "${userKey}" non trouvé dans users.json`)
        }

        cy.request({
            method: 'POST',
            url: apiRoutes.login,
            body: user,
            failOnStatusCode: failOnError 
        }).then((response) => {
            if(response.status == 200) {
                window.localStorage.setItem('userToken', response.body.token)
            }            
        })
    })
})

Cypress.Commands.add('getToken', () => {
    return cy.wrap(localStorage.getItem('userToken')).then((token) => {
        if (!token) {
            throw new Error('Token non trouvé dans le localStorage')
        }
    return token
    })
})

Cypress.Commands.add('authRequest', (options) => {
    return cy.getToken().then((token) => {
        return cy.request({
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`,
            }
        })
    })
})

declare global {
    namespace Cypress {
        interface Chainable {
            /**
            * Custom command to select DOM element by data-cy attribute.
            * @example cy.getBySel('example')
            */
            getBySel(selector: string, ...args: any[]): Chainable<JQuery<HTMLElement>>

            /**
            * Custom command to log in in UI with a known user.
            * @example cy.login()
            */
            login(): Chainable<void>

            /**
            * Custom command to log in in login API with a known user from the fixture users.json as default and store the token
            * @example cy.loginAPI()
            * @example cy.loginAPI('utilisateurInconnu')
            */
            loginAPI(userKey?: string): Chainable<void>

            /**
            * Custom command to get the token from localStorage
            * @returns Le token sous forme de string
            */
            getToken(): Chainable<string>

            /**
            * Custom command for HTTP request with stored token in header Authorization
            * @param options Options for cy.request
            */
            authRequest(options: Partial<Cypress.RequestOptions>): Chainable<Cypress.Response<any>>
        }    
    }
}
