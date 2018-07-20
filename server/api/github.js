const router = require('express').Router()
const { Framework } = require('../db/models')
const axios = require('axios').create({
  headers: {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json'
  }
})
const moment = require('moment')
module.exports = router

router.get('/stats', async (req, res, next) => {
  try {
    const frameworks = await Framework.findAll({
      attributes: ['githubPath']
    })
    const repoAddresses = frameworks.map(framework => framework.githubPath)
    const lastWeek = moment().subtract(7, 'd').hour(0).format()

    const repoPromises = repoAddresses.map(address => {
      return axios.get(`https://api.github.com/repos/${address}`)
    })
    const prPromises = repoAddresses.map(address => {
      return axios.get(`https://api.github.com/search/issues?q=repo:${address}+type:pr+merged:>=${lastWeek}`)
    })
    const issuePromises = repoAddresses.map(address => {
      return axios.get(`https://api.github.com/search/issues?q=repo:${address}+type:issue+updated:>=${lastWeek}`)
    })

    const repos = await Promise.all(repoPromises)
    const prs = await Promise.all(prPromises)
    const issues = await Promise.all(issuePromises)

    const response = {}
    repoAddresses.forEach((address, i) => {
      response[address] = {}
      response[address].stars = repos[i].data.stargazers_count
      response[address].prs = prs[i].data.items.length
      response[address].issues = issues[i].data.items.length
    })

    res.json(response)
  } catch (error) {
    next(error)
  }
})
