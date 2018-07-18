const Sequelize = require('sequelize')
const db = require('../db')

const Vote = db.define('votes', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
    unique: 'userSession'
  },
  sessionId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  unique: 'userSession'
})

module.exports = Vote
