import express from 'express'
import cors from 'cors'
import connectDb from './config/db'
import config from './config/config'
import { userRoute, projectRoute, taskRoute } from './routes'

const app = express()
connectDb().catch(() => {
  console.log('Error connecting to the DataBase')
})

// config cors
const whiteList = [config.FRONTED_URL]

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whiteList.includes(origin)) {
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

app.listen(PORT, () => {
  console.log(`Server running ON PORT ${PORT}`)
})
