import { RequestHandler, Router } from 'express'
import checkAuth from '../middleware/checkAuth'
import {
  getProjects,
  createProject,
  getProject,
  editProject,
  deleteProject,
  searchCollaborator,
  addCollaborator,
  removeCollaborator

} from '../controllers/projectController'

const router = Router()

router.route('/')
  .get(checkAuth as RequestHandler, getProjects as RequestHandler)
  .post(checkAuth as RequestHandler, createProject as RequestHandler)

router.post('/collaborator', checkAuth as RequestHandler, searchCollaborator as RequestHandler)
router.post('/collaborator/:id', checkAuth as RequestHandler, addCollaborator as RequestHandler)
router.post('/remove-collaborator/:id', checkAuth as RequestHandler, removeCollaborator as RequestHandler)

router.route('/:id')
  .get(checkAuth as RequestHandler, getProject as RequestHandler)
  .put(checkAuth as RequestHandler, editProject as RequestHandler)
  .delete(checkAuth as RequestHandler, deleteProject as RequestHandler)

export default router
