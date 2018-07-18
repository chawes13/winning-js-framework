const Sequelize = require('sequelize')
const db = require('../db')

const Framework = db.define('frameworks', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  githubUrl: {
    type: Sequelize.STRING,
    validate: {
      isUrl: true,
    }
  },
  stars: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  mergedPullRequests: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  proposedPullRequests: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  newIssues: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  closedIssues: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
})

module.exports = Framework
