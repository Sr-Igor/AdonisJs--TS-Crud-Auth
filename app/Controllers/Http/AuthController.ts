import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {

  public async login ({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.body()
    const token = await auth.attempt(email, password)
    return token;
  }

  public async logout ({auth}: HttpContextContract) {
    await auth.logout()
  }

  public async me ({auth}: HttpContextContract) {
    return auth.user
  }
}
