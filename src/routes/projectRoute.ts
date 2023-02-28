import { RequestHandler, Router } from 'express'
import {
  getProjects,
  createProject,
  getProject,
  editProject,
  deleteProject,
  addPartner,
  removePartner,
  getTasks
} from '../controllers/projectController'
import checkAuth from '../middleware/checkAuth'

const router = Router()

router.route('/')
  .get(checkAuth as RequestHandler, getProjects as RequestHandler)
  .post(checkAuth as RequestHandler, createProject as RequestHandler)

router.route('/:id')
  .get(checkAuth as RequestHandler, getProject as RequestHandler)
  .put(checkAuth as RequestHandler, editProject as RequestHandler)
  .delete(checkAuth as RequestHandler, deleteProject as RequestHandler)

router.get('/tasks/:id', checkAuth as RequestHandler, getTasks as RequestHandler)
router.post('add-partner/:id', checkAuth as RequestHandler, addPartner as RequestHandler)
router.post('remove-partner/:id', checkAuth as RequestHandler, removePartner as RequestHandler)

export default router
