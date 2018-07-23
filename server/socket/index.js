const axios = require('axios').create({
  headers: {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json'
  }
})
const { Framework } = require('../db/models')
const moment = require('moment')

const updateFrameworkStats = async () => {
  try {
    const lastWeek = moment().subtract(7, 'd').format('YYYY-MM-DD')
    const frameworks = await Framework.findAll({
      attributes: ['id', 'name', 'githubPath']
    })

    const repoPromises = frameworks.map(framework => {
      return axios.get(`https://api.github.com/repos/${framework.githubPath}`)
    })
    const prPromises = frameworks.map(framework => {
      return axios.get(`https://api.github.com/search/issues?q=repo:${framework.githubPath}+type:pr+merged:>=${lastWeek}`)
    })
    const issuePromises = frameworks.map(framework => {
      return axios.get(`https://api.github.com/search/issues?q=repo:${framework.githubPath}+type:issue+updated:>=${lastWeek}`)
    })

    const repos = await Promise.all(repoPromises)
    const prs = await Promise.all(prPromises)
    const issues = await Promise.all(issuePromises)

    const updatedFrameworks = await Promise.all(frameworks.map((framework, i) =>  {
      return framework.update({
        stars: repos[i].data.stargazers_count,
        pullRequests: prs[i].data.total_count,
        activeIssues: issues[i].data.total_count,
      })
    }))

    return updatedFrameworks
  } catch (error) {
    console.error(error)
  }
}

/** Refresh logic:
 * Check every interval to _potentially_ call GitHub API
 * If at least 1 client is connected OR a maximum interval has passed, call GitHub API
 * Else increment "current" interval
 */
const maxInterval = process.env.GITHUB_API_MAX_INTERVAL || 900000 // default 15 minutes (in ms)
const interval = process.env.GITHUB_API_INTERVAL || 30000 // default 30 s (in ms)
let currentInterval = 0

module.exports = io => {

  const maybeRefreshData = async () => {
    if (io.engine.clientsCount > 0 || currentInterval >= maxInterval) {
      console.log('Fetching new data from GitHub...')
      const updatedFrameworks = await updateFrameworkStats()
      if (updatedFrameworks && updatedFrameworks.length > 0) {
        io.emit('server:new-data', updatedFrameworks)
      }
      currentInterval = 0
    } else {
      currentInterval += interval
    }
    setTimeout(maybeRefreshData, interval)
  }

  setTimeout(maybeRefreshData, interval)

  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)
    console.log('Number of connected clients', io.engine.clientsCount)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has disconnected`)
      console.log('Number of connected clients', io.engine.clientsCount)
    })
  })
}
