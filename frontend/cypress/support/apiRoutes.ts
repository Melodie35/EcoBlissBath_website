// définition de l'environnement
const apiUrl = Cypress.env('apiUrl')

// définition des URL API
const apiRoutes = {
  login: apiUrl + '/login',
  orders: apiUrl + '/orders',
  addOrder: apiUrl + '/orders/add',
  product: (id: number) => `${apiUrl}/products/${id}`,
  products: apiUrl + '/products',  
  reviews: apiUrl + '/reviews'
}

export default apiRoutes