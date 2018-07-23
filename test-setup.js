const db = require('./server/db')
const Adapter = require('enzyme-adapter-react-16')
const enzyme = require('enzyme')

const adapter = new Adapter()
enzyme.configure({adapter})

beforeEach(() => {
  return db.sync({force: true})
})

afterAll(() => {
  return db.close()
})
