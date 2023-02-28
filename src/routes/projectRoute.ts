import { RequestHandler, Router } from 'express'
import checkAuth from '../middleware/checkAuth'
import {
  getProjects,
  createProject,
  getProject,
  editProject,
  deleteProject,
  addPartner,
  removePartner
} from '../controllers/projectController'

const router = Router()

router.route('/')
  .get(checkAuth as RequestHandler, getProjects as RequestHandler)
  .post(checkAuth as RequestHandler, createProject as RequestHandler)

router.route('/:id')
  .get(checkAuth as RequestHandler, getProject as RequestHandler)
  .put(checkAuth as RequestHandler, editProject as RequestHandler)
  .delete(checkAuth as RequestHandler, deleteProject as RequestHandler)

router.post('add-partner/:id', checkAuth as RequestHandler, addPartner as RequestHandler)
router.post('remove-partner/:id', checkAuth as RequestHandler, removePartner as RequestHandler)

export default router
