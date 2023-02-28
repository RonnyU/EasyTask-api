import express from 'express'
import connectDb from './config/db'
import config from './config/config'
import { userRoute, projectRoute } from './routes'

const app = express()
connectDb().catch(() => {
  console.log('Error connecting to the DataBase')
})

const PORT = config.PORT ?? 4000

app.use(express.json())

// Routing
app.get('/ping', (_, res) => {
  console.log('someone pinged here!!')
  res.send('ping')
})

app.use('/api/users', userRoute)
app.use('/api/projects', projectRoute)

app.listen(PORT, () => {
  console.log(`Server running ON PORT ${PORT}`)
})
