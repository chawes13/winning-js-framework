const router = require('express').Router()
const Sequelize = require('sequelize')
const { Framework, Vote } = require('../db/models')
module.exports = router

// Return all votes (single API)
router.get('/', async (req, res, next) => {
  try {
    const totalVotes = Sequelize.fn('COUNT', Sequelize.col('votes.id'))
    const frameworks = await Framework.findAll({
      attributes: ['name', 'githubUrl', [totalVotes, 'totalVotes']],
      include: [{ model: Vote, required: false, attributes: [] }],
      group: [Sequelize.col('frameworks.id')],
      order: [[totalVotes, 'DESC'], ['updatedAt', 'DESC']],
    })
    res.json(frameworks)
  } catch (error) {
    console.error(error)
  }
})

// Cast a vote (if haven't already voted)
router.post('/', async (req, res, next) => {
  try {
    // TODO: findOrCreate a vote based on email and sessionId
    res.send('Thanks for voting!')
  } catch(error) {
    console.error(error)
  }
})
