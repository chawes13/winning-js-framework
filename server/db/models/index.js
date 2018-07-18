const Framework = require('./framework')
const Vote = require('./vote')

Vote.belongsTo(Framework)
Framework.hasMany(Vote)

module.exports = {
  Framework,
  Vote
}
