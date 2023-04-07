import { Request, Response } from 'express'
import { IGetUserAuthInfoRequest } from '../extended-types/types'
import Project from '../models/Project'
import User from '../models/User'

const getProjects = async (req: Request, res: Response): Promise<any> => {
  const user = (req as IGetUserAuthInfoRequest).user
  try {
    const projects = await Project.find({
      $or: [
        { collaborator: { $in: user } },
        { createdby: { $in: user } }
      ]
    }).select('-tasks')
    res.json(projects)
  } catch (error) {
    console.log(error)
  }
}

const createProject = async (req: Request, res: Response): Promise<any> => {
  const project = new Project(req.body)
  project.createdby = (req as IGetUserAuthInfoRequest).user._id

  try {
    const projectStored = await project.save()
    res.json(projectStored)
  } catch (error) {
    console.log('error when trying to create a new project: ', error)
  }
}

const getProject = async (req: Request, res: Response): Promise<any> => {
  let error: Error
  const { id } = req.params
  const userId = (req as IGetUserAuthInfoRequest).user._id

  try {
    const project = await Project.findById(id).populate({ path: 'tasks', populate: { path: 'completed', select: 'name' } }).populate('collaborator', 'email name')

    if (project == null) {
      error = new Error('The project does not exists')
      return res.status(404).json({ msg: error.message })
    }

    const validCollaborator = project.collaborator.some((col) => col._id.toString() === userId.toString())

    if (String(project.createdby) !== String(userId) && !validCollaborator) {
      error = new Error('Invalid action')
      return res.status(401).json({ msg: error.message })
    }

    res.json(project)
  } catch (error) {
    console.log(error)
  }
}

const editProject = async (req: Request, res: Response): Promise<any> => {
  let error: Error
  const { id } = req.params
  const { name, description, client } = req.body
  const userId = (req as IGetUserAuthInfoRequest).user._id

  try {
    const project = await Project.findById(id)

    if (project == null) {
      error = new Error('The project does not exists')
      return res.status(404).json({ msg: error.message })
    }

    if (String(project.createdby) !== String(userId)) {
      error = new Error('Invalid action')
      return res.status(401).json({ msg: error.message })
    }

    project.name = name || project.name
    project.description = description || project.description
    project.client = client || project.client

    const projectStored = await project.save()
    res.json(projectStored)
  } catch (error) {
    console.log(error)
  }
}

const deleteProject = async (req: Request, res: Response): Promise<any> => {
  let error: Error
  const { id } = req.params
  const userId = (req as IGetUserAuthInfoRequest).user._id

  try {
    const project = await Project.findById(id)

    if (project == null) {
      error = new Error('The project does not exists')
      return res.status(404).json({ msg: error.message })
    }

    if (String(project.createdby) !== String(userId)) {
      error = new Error('Invalid action')
      return res.status(401).json({ msg: error.message })
    }

    await project.deleteOne()
    res.json({ msg: 'Project Deleted successfully' })
  } catch (error) {
    console.log(error)
  }
}

const searchCollaborator = async (req: Request, res: Response): Promise<any> => {
  let error: Error

  const { email } = req.body
  const user = await User.findOne({ email }).select('email name _id')

  if (user == null) {
    // TODO Create and Improve Error handler
    error = new Error('The user does not exists')
    return res.status(404).json({ msg: error.message })
  }

  res.json(user)
}

const addCollaborator = async (req: Request, res: Response): Promise<any> => {
  let error: Error
  const userId = (req as IGetUserAuthInfoRequest).user._id
  const { email } = req.body
  const project = await Project.findById(req.params.id)

  if (project == null) {
    error = new Error('The project does not exists')
    return res.status(404).json({ msg: error.message })
  }

  if (String(project.createdby) !== String(userId)) {
    error = new Error('Invalid action')
    return res.status(401).json({ msg: error.message })
  }

  const user = await User.findOne({ email }).select('email name _id')

  if (user == null) {
    error = new Error('The user does not exists')
    return res.status(404).json({ msg: error.message })
  }

  if (String(project.createdby) === String(user._id)) {
    error = new Error('The project creator user cannot be added as a collaborator')
    return res.status(401).json({ msg: error.message })
  }

  if (project.collaborator.includes(user._id)) {
    error = new Error('That user is a collaborator already')
    return res.status(401).json({ msg: error.message })
  }

  project.collaborator.push(user._id)

  await project.save()

  res.json({ msg: 'Collaborator added successfully' })
}

const removeCollaborator = async (req: Request, res: Response): Promise<any> => {
  let error: Error
  const userId = (req as IGetUserAuthInfoRequest).user._id

  const project = await Project.findById(req.params.id)

  if (project == null) {
    error = new Error('The project does not exists')
    return res.status(404).json({ msg: error.message })
  }

  if (String(project.createdby) !== String(userId)) {
    error = new Error('Invalid action')
    return res.status(401).json({ msg: error.message })
  }

  // await project.updateOne({ _id: req.params.id }, { $pull: { collaborator: req.body.id } })
  project.collaborator.pull(req.body.id)

  await project.save()

  res.json({ msg: 'A collaborator has been removed successfully' })
}

export {
  getProjects,
  createProject,
  getProject,
  editProject,
  deleteProject,
  searchCollaborator,
  addCollaborator,
  removeCollaborator

}
