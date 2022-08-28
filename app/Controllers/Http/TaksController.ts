import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import Tak from 'App/Models/Tak'

export default class TaksController {
  public async index({auth}: HttpContextContract) {

    let tasks = await Tak.query().where('user_id', auth.user!.id).preload('user')
    return tasks
  }

  public async store({request, response,auth}: HttpContextContract) {
    let user = auth.user!
    let data = request.only([
      'title',
      'due_date',
      'description',
      'price',
      'is_completed',
      'categoryId'
    ])

    if(data.description && data.description.length > 100) {
      return response.status(400).send({
        error: 'A descrição não pode ter mais que 100 caracteres'
      })
    }

    if(data.due_date && new Date(data.due_date).toString() == 'Invalid Date') {
      return response.status(400).send({
        error: 'Data inválida'
      })
    }

    let category = await Category.find(data.categoryId)
    if(!category) {
      return response.status(400).send({
        error: 'Categoria não encontrada'
      })
    }

    if(category.userId !== auth.user!.id) {
      return response.status(401).send({
        error: 'Você não tem permissão para criar tarefas nesta categoria'
      })
    }

    let newTask = await Tak.create({...data, userId: user.id})
    let newTaskJSON = newTask.toJSON()
    response.status(201).send({
      message: 'Tarefa criada com sucesso',
      task: {...newTaskJSON, category}
    })
  }

  public async show({request, response, auth}: HttpContextContract) {
    let {id} = request.params()
    let task = await Tak.find(id)

    if(!task) {
      return response.status(400).send({
        error: 'Tarefa não encontrada'
      })
    }

    if(task.userId !== auth.user!.id) {
      return response.status(401).send({
        error: 'Você não tem permissão para acessar esta tarefa'
      })
    }

    await task.preload('user')
    await task.preload('category')

    response.status(200).send(task)
  }

  public async update({request, response, auth}: HttpContextContract) {
    let {id} = request.params()
    let task = await Tak.find(id)

    if(!task) {
      return response.status(400).send({
        error: 'Tarefa não encontrada'
      })
    }

    if(task.userId !== auth.user!.id) {
      return response.status(401).send({
        error: 'Você não tem permissão para acessar esta tarefa'
      })
    }

    let data = request.only([
      'title',
      'due_date',
      'description',
      'price',
      'is_completed',
      'categoryId'
    ])

    let category = await Category.find(data.categoryId)
    if(!category) {
      return response.status(400).send({
        error: 'Categoria não encontrada'
      })
    }

    if(data.description && data.description.length > 100) {
      return response.status(400).send({
        error: 'A descrição não pode ter mais que 100 caracteres'
      })
    }

    if(data.due_date && new Date(data.due_date).toString() == 'Invalid Date') {
      return response.status(400).send({
        error: 'Data inválida'
      })
    }

    task.merge(data)
    await task.save()
    response.status(204).send({
      message: 'Tarefa atualizada com sucesso'
    })
  }

  public async destroy({request, response, auth}: HttpContextContract) {
    let {id} = request.params()
    let task = await Tak.find(id)

    if(!task) {
      return response.status(400).send({
        error: 'Tarefa não encontrada'
      })
    }

    if(task.userId !== auth.user!.id) {
      return response.status(401).send({
        error: 'Você não tem permissão para acessar esta tarefa'
      })
    }

    await task.delete()
    response.status(204).send({
      message: 'Tarefa deletada com sucesso'
    })

  }
}
