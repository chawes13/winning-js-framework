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
  stars: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  pullRequests: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  activeIssues: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
})

module.exports = Framework
