const Sequelize = require('sequelize')
const db = require('../db')

const Framework = db.define('frameworks', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  githubPath: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
})

module.exports = Framework
