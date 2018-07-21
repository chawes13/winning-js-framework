const router = require('express').Router()
const { Framework } = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const frameworks = await Framework.findAll()
    res.json(frameworks)
  } catch (error) {
    next(error)
  }
})
