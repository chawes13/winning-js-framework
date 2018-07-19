const router = require('express').Router()
const Sequelize = require('sequelize')
const { Framework, Vote } = require('../db/models')
module.exports = router

// Return all votes (single API)
router.get('/', async (req, res, next) => {
  try {
    const totalVotes = Sequelize.fn('COUNT', Sequelize.col('votes.id'))
    const frameworks = await Framework.findAll({
      attributes: ['name', [totalVotes, 'totalVotes']],
      include: [{ model: Vote, required: false, attributes: [] }],
      group: [Sequelize.col('frameworks.id')],
      order: [[totalVotes, 'DESC'], ['updatedAt', 'DESC']],
    })
    res.json(frameworks)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const framework = await Framework.findOne({
      where: {
        name: req.body.framework
      }
    })
    if (framework) {
      const voteOptions = {
        where: {
          email: req.body.email,
          sessionId: req.session.id
        }
      }
      const [vote, created] = await Vote.findOrCreate(voteOptions)
      if (vote.frameworkId === framework.id) {
        res.status(200).send('Your vote for this framework has already been recorded')
      } else {
        await vote.setFramework(framework)
        const confirmationMsg = created ? 'Thanks for voting!' : 'Your vote has been updated!'
        res.status(201).send(confirmationMsg)
      }
    } else {
      const error = new Error('Selected framework is not eligible for voting')
      error.status(400)
      next(error)
    }
  } catch(error) {
    next(error)
  }
})
