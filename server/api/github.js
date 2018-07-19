const router = require('express').Router()
const axios = require('axios')
module.exports = router

// TODO: Decide on creating 1 parameterized route or having separate routes
router.get('/react', async (req, res, next) => {
  try {
    const { data: repo } = await axios.get('https://api.github.com/repos/facebook/react', {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    })
    res.json(repo)
  } catch (error) {
    console.error(error)
  }
})
