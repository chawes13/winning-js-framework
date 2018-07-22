const request = require('supertest')
const app = require('../')
const { Framework } = require('../db/models')

describe('Frameworks API', () => {
  describe('GET /api/frameworks', () => {
    test('returns existing frameworks', async () => {
      await Promise.all([
        Framework.create({name: 'React', githubPath: 'facebook/react'}),
        Framework.create({name: 'Angular', githubPath: 'angular/angular.js'}),
        Framework.create({name: 'Ember', githubPath: 'emberjs/ember.js'}),
        Framework.create({name: 'Vue', githubPath: 'vuejs/vue'}),
      ])

      return request(app)
        .get('/api/frameworks')
        .expect(200)
        .then(res => {
          expect(res.body).toHaveLength(4)
          expect(res.body.find(framework => framework.name === 'Vue')).toBeDefined()
        })
    })
  })
})
