const express = require('express')
const volleyball = require('volleyball')
const bodyParser = require('body-parser')
const compression = require('compression')
const session = require('express-session')
const path = require('path')
const PORT = process.env.PORT || 8080
const db = require('./db')
const app = express()
const socketio = require('socket.io')

module.exports = app

if (process.env.NODE_ENV !== 'production') require('../secrets')

// Creating as a function for ease of testing
const createApp = () => {
  app.use(volleyball)
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(compression())
  app.use(session({
    secret: process.env.SESSION_SECRET || 'LaunchPad is amazing',
    resave: false,
    saveUninitialized: true,
  }))

  // API routes
  app.use('/api', require('./api'))

  app.use(express.static(path.join(__dirname, '..', 'public')))

  // SPA should always serve the index.html
  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'))
  })

  // Error handling
  app.use((error, req, res, next) => {
    console.error(error)
    res.status(error.status || 500).send(error.message || 'Internal server error')
  })
}

const startListening = () => {
  const server = app.listen(PORT, () => {
    console.log(`Keep calm and deploy on ${PORT}`)
  })

  const io = socketio(server)
  require('./socket')(io)
}

const syncDb = () => db.sync()

async function startApp() {
  await syncDb()
  await createApp()
  await startListening()
}

if (require.main === module) {
  startApp()
} else {
  createApp()
}
