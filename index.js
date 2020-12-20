require('dotenv').config()
const express = require('express')
require('./models')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const {
  getTimeSheets,
  saveTimeSheets,
  reportByWeek,
  updateCreateUser,
  getUsers,
  updateUserProfile,
  me,
} = require('./controller/timeSheet')

const app = express()

// MongoDb
const MONGO_URI = process.env.MONGO_DB_URL || 'mongodb://localhost/timetracker'
if (!MONGO_URI) {
  throw new Error('You must provide a Mongo URI')
}
const mongoOptions = {
  socketTimeoutMS: 30000,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  keepAlive: 1,
}
mongoose.Promise = global.Promise
mongoose.connect(MONGO_URI, mongoOptions)
mongoose.connection
  .once('open', () => console.log('Connected to Mongo instance.'))
  .on('error', error => console.error('Error connecting to Mongo:', error))

// middlewares
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://global-time-tracker.now.sh', 'https://global-time-tracker.cpenarrieta.vercel.app'],
    credentials: true,
  }),
)

// routes
app.get('/list', getTimeSheets)
app.get('/getUsers', getUsers)
app.get('/me', me)
app.post('/save', saveTimeSheets)
app.post('/updateUserProfile', updateUserProfile)
app.post('/updateCreateUser', updateCreateUser)
app.get('/reportByWeek/:startDate', reportByWeek)
app.get('/test', (req, res) => res.json({ test: 'cristian 6' }))

// server
if (!module.parent) {
  app.listen(process.env.PORT || 8080, err => {
    if (err) {
      console.error('Cannot run')
    } else {
      console.log(`
        TimeTracker API V2 is working 🍺
        App listen on port: ${process.env.PORT} 🍕
        Env: ${process.env.NODE_ENV} 🦄
      `)
    }
  })
}
module.exports = app
