const db = require('./server/db')

beforeEach(() => {
  return db.sync({force: true})
})

afterAll(() => {
  return db.close()
})

