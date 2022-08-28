import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('/login', 'AuthController.login')

Route.group(() => {
  Route.post('/logout', 'AuthController.logout')
  Route.get('/me', "AuthController.me")

  Route.resource('/categories', 'CategoriesController').apiOnly()
  Route.resource('/task', 'TaksController').apiOnly()

}).middleware(['auth'])
