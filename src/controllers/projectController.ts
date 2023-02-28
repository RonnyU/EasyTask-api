import { Request, Response } from 'express'
import { IGetUserAuthInfoRequest } from '../extended-types/types'
import Project from '../models/Project'
import Task from '../models/Task'

const getProjects = async (req: Request, res: Response): Promise<any> => {
  try {
    const projects = await Project.find().where('createdby').equals((req as IGetUserAuthInfoRequest).user)
    res.json({ projects })
  } catch (error) {
    console.log(error)
  }
}

const createProject = async (req: Request, res: Response): Promise<any> => {
  const project = new Project(req.body)
  project.createdby = (req as IGetUserAuthInfoRequest).user._id

  try {
    const projectStored = await project.save()
    res.json({ projectStored })
  } catch (error) {
    console.log('error when trying to create a new project: ', error)
  }
}

const getProject = async (req: Request, res: Response): Promise<any> => {
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

    // get all task related to the project
    const task = await Task.find().where('project').equals(project._id)

    res.json({ project, task })
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
    res.json({ projectStored })
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

const addPartner = async (_req: Request, res: Response): Promise<any> => {
  res.json({
    addPartner: 'working well'
  })
}

const removePartner = async (_req: Request, res: Response): Promise<any> => {
  res.json({
    removePartner: 'working well'
  })
}

export {
  getProjects,
  createProject,
  getProject,
  editProject,
  deleteProject,
  addPartner,
  removePartner
}
