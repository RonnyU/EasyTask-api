import { RequestHandler, Router } from 'express'
import checkAuth from '../middleware/checkAuth'
import {
  addTask,
  getTask,
  updateTask,
  removeTask,
  changeStatus
} from '../controllers/taskController'

const router = Router()

router.post('/', checkAuth as RequestHandler, addTask as RequestHandler)

router.route('/:id')
  .get(checkAuth as RequestHandler, getTask as RequestHandler)
  .put(checkAuth as RequestHandler, updateTask as RequestHandler)
  .delete(checkAuth as RequestHandler, removeTask as RequestHandler)

router.post('/status/:id', checkAuth as RequestHandler, changeStatus as RequestHandler)

export default router
