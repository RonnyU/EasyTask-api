import { Request, Response } from 'express'
import Project from '../models/Project'
import Task from '../models/Task'
import { IGetUserAuthInfoRequest } from '../extended-types/types'

const addTask = async (req: Request, res: Response): Promise<any> => {
  let error: Error
  const { project } = req.body
  const userId = (req as IGetUserAuthInfoRequest).user._id

  const projectFound = await Project.findById(project)

  if (!projectFound) {
    error = new Error('The project does not exists')
    return res.status(404).json({ msg: error.message })
  }

  if (String(projectFound.createdby) !== String(userId)) {
    error = new Error('you do not have the rights to modify a task')
    return res.status(401).json({ msg: error.message })
  }

  try {
    const taskStored = await Task.create(req.body)

    // save ID into the project
    projectFound.tasks.push(taskStored._id)
    await projectFound.save()

    res.json(taskStored)
  } catch (error) {
    console.log(error)
  }
}

const getTask = async (req: Request, res: Response): Promise<any> => {
  let error: Error
  const { id } = req.params
  const userId = (req as IGetUserAuthInfoRequest).user._id

  const task = await Task.findById(id).populate('project')

  if (!task) {
    error = new Error('The task does not exists')
    return res.status(404).json({ msg: error.message })
  }

  if (String(task.project.createdby) !== String(userId)) {
    error = new Error('Invalid Action')
    return res.status(401).json({ msg: error.message })
  }
  res.json(task)
}

const updateTask = async (req: Request, res: Response): Promise<any> => {
  let error: Error
  const { id } = req.params
  const userId = (req as IGetUserAuthInfoRequest).user._id
  const { name, description, priority, deadline } = req.body

  const task = await Task.findById(id).populate('project')

  if (!task) {
    error = new Error('The task does not exists')
    return res.status(404).json({ msg: error.message })
  }

  if (String(task.project.createdby) !== String(userId)) {
    error = new Error('Invalid Action')
    return res.status(401).json({ msg: error.message })
  }

  task.name = name || task.name
  task.description = description || task.description
  task.priority = priority || task.priority
  task.deadline = deadline || task.deadline

  try {
    const taskStored = await task.save()
    res.json(taskStored)
  } catch (error) {
    console.log(error)
  }
}

const removeTask = async (req: Request, res: Response): Promise<any> => {
  let error: Error
  const { id } = req.params
  const userId = (req as IGetUserAuthInfoRequest).user._id

  const task = await Task.findById(id).populate('project')

  if (!task) {
    error = new Error('The task does not exists')
    return res.status(404).json({ msg: error.message })
  }

  if (String(task.project.createdby) !== String(userId)) {
    error = new Error('Invalid Action')
    return res.status(401).json({ msg: error.message })
  }

  try {
    await task.deleteOne()
    res.json({ msg: 'Task removed' })
  } catch (error) {
    console.log(error)
  }
}

const changeStatus = async (_req: Request, res: Response): Promise<any> => {
  res.json({ msg: 'WORKING change status' })
}

export {
  addTask,
  getTask,
  updateTask,
  removeTask,
  changeStatus
}
