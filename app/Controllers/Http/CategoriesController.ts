import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'

export default class CategoriesController {
  public async index({auth}: HttpContextContract) {
    // Exibe todas as categorias
    let categories = await Category.query().where('user_id', auth.user!.id).preload('user')
    return categories
  }

  public async store({request, auth, response}: HttpContextContract) {
    let data = request.only(['title', 'color'])
    let user = auth.user!

    let newCategory = await Category.create({...data, userId: user.id})
    response.status(201).send({
      message: 'Categoria criada com sucesso',
      category: newCategory
    })
  }

  public async show({request, response, auth}: HttpContextContract) {
    let {id} = request.params()
    let category = await Category.findOrFail(id)

    if(category.userId !== auth.user!.id) {
      return response.status(401).send({
        error: 'Você não tem permissão para acessar esta categoria'
      })
    }

    await category.preload('user')
    response.status(200).send(category)
  }

  public async update({request, auth, response}: HttpContextContract) {
    let {id} = request.params()
    let category = await Category.findOrFail(id)

    if(category.userId !== auth.user!.id) {
      return response.status(401).send({
        error: 'Você não tem permissão para alterar esta categoria'
      })
    }

    let data = request.only(['title', 'color'])
    category.merge(data)
    await category.save()
    response.status(200).send({
      message: 'Categoria atualizada com sucesso',
      category
    })
  }

  public async destroy({request, auth, response}: HttpContextContract) {
    let {id} = request.params()
    let category = await Category.findOrFail(id)

    if(category.userId !== auth.user!.id) {
      return response.status(401).send({
        error: 'Você não tem permissão para excluir esta categoria'
      })
    }

    await category.delete()
    response.status(200).send({
      message: 'Categoria excluída com sucesso'
    })
  }
}
