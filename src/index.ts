import express from 'express'
import cors from 'cors'
import connectDb from './config/db'
import config from './config/config'
import { userRoute, projectRoute, taskRoute } from './routes'
import { Server } from 'socket.io'

const app = express()
connectDb().catch(() => {
  console.log('Error connecting to the DataBase')
})

// config cors

const whiteList = [config.FRONTED_URL]

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whiteList.includes(origin) || origin === undefined) {
      callback(null, true)
    } else {
      callback(new Error('Cors Error'))
    }
  }
}

app.use(cors(corsOptions))

const PORT = config.PORT ?? 4000

app.use(express.json())

// Routing
app.get('/ping', (_, res) => {
  console.log('someone pinged here!!')
  res.send('ping')
})

app.use('/api/users', userRoute)
app.use('/api/projects', projectRoute)
app.use('/api/tasks', taskRoute)

const easyTaskServer = app.listen(PORT, () => {
  console.log(`Server running ON PORT ${PORT}`)
})

//* SOCKET IO
const io = new Server(easyTaskServer, {
  pingTimeout: 60000,
  cors: {
    origin: config.FRONTED_URL
  }
})

io.on('connection', (socket) => {
  socket.on('openProject', async (projectId) => {
    await socket.join(projectId)
  })

  socket.on('newTask', async (task) => {
    const projectId = task.project
    socket.to(projectId).emit('taskAdded', task)
  })

  socket.on('deleteTask', async (task) => {
    const projectId = task.project
    socket.to(projectId).emit('taskDeleted', task)
  })
  socket.on('updateTask', async (task) => {
    const projectId = task.project._id
    socket.to(projectId).emit('taskUpdated', task)
  })
  socket.on('completeTask', async (task) => {
    const projectId = task.project._id
    socket.to(projectId).emit('taskCompleted', task)
  })
})
