
let initData = [
  {
    id: 1,
    name: "react",
    stars: 5,
    "pull-requests": 10,
    issues: 300,
  },
  {
    id: 2,
    name: "ember",
    stars: 2,
    "pull-requests": 8,
    issues: 250,
  },
  {
    id: 3,
    name: "vue",
    stars: 1,
    "pull-requests": 16,
    issues: 12,
  },
  {
    id: 4,
    name: "angular",
    stars: 10,
    "pull-requests": 0,
    issues: 500,
  }]

const getGithubInfo = async () => {
  return initData
}

module.exports = io => {
  io.on('connection', async socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)
    const info = await getGithubInfo()
    socket.emit('server:initial-data', info)
    setTimeout(() => {
      let newData = initData.map(framework => ({...framework, stars: framework.stars + 2}))
      socket.emit('server:new-data', newData)
      initData = newData
    }, 5000)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has disconnected`)
    })
  })
}
