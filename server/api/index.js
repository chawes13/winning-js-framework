const router = require('express').Router()
module.exports = router

router.use('/frameworks', require('./frameworks'))
router.use('/votes', require('./votes'))

// 404 handler
router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
