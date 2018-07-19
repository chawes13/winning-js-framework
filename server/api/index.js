const router = require('express').Router()
module.exports = router

router.use('/github', require('./github'))
router.use('/votes', require('./votes'))

// 404 handler
router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
