const request = require('supertest')
const app = require('../')
const { Framework, Vote } = require('../db/models')

describe('Votes API', () => {
  describe('GET /api/votes', () => {
    test('retrieves summary of framework votes', async () => {
      await Promise.all([
        Framework.create({name: 'React', githubPath: 'facebook/react'}),
        Framework.create({name: 'Angular', githubPath: 'angular/angular.js'}),
        Framework.create({name: 'Ember', githubPath: 'emberjs/ember.js'}),
        Framework.create({name: 'Vue', githubPath: 'vuejs/vue'}),
      ])
      await Promise.all([
        Vote.create({email: 'react@email.com', sessionId: '1', frameworkId: 1}),
        Vote.create({email: 'angular@email.com', sessionId: '2', frameworkId: 2}),
        Vote.create({email: 'ember@email.com', sessionId: '3', frameworkId: 3}),
        Vote.create({email: 'vue@email.com', sessionId: '4', frameworkId: 1}),
        Vote.create({email: 'redux@email.com', sessionId: '5', frameworkId: 1}),
      ])

      return request(app)
        .get('/api/votes')
        .expect(200)
        .then(res => {
          const react = res.body.find(vote => vote.name === 'React')
          expect(react.totalVotes).toEqual('3')
        })
    })
  })

  describe('POST /api/votes', () => {
    test('creates a vote', async () => {
      await Framework.create({name: 'React', githubPath: 'facebook/react'})
      const vote = {
        framework: 'React',
        email: 'test@example.com'
      }

      return request(app)
        .post('/api/votes')
        .send(vote)
        .expect(201)
        .then(res => {
          expect(res.text).toEqual('Thanks for voting!')
        })
    })

    test('does not create a vote for a framework that does not exist', () => {
      const vote = {
        framework: 'angvueact',
        email: 'test@example.com'
      }
      return request(app)
        .post('/api/votes')
        .send(vote)
        .expect(400)
    })

    test('does not create a vote for an email & session that already voted', async () => {
      // Capturing the agent allows the same session to be re-used
      const agent = request.agent(app)
      await Framework.create({name: 'React', githubPath: 'facebook/react'})
      const vote = {
        framework: 'React',
        email: 'test@example.com'
      }

      await agent.post('/api/votes').send(vote)
      return agent
        .post('/api/votes')
        .send(vote)
        .then(res => {
          expect(res.text).toEqual('Your vote for this framework has already been recorded')
          return Vote.count()
        }).then(count => {
          expect(count).toEqual(1)
        })
    })

    test('will update the selected vote for an email & session that already voted', async () => {
      const agent = request.agent(app)
      await Promise.all([
        Framework.create({name: 'React', githubPath: 'facebook/react'}),
        Framework.create({name: 'Angular', githubPath: 'angular/angular.js'})
      ])
      const firstVote = {
        framework: 'React',
        email: 'test@example.com',
      }
      const secondVote = {
        framework: 'Angular',
        email: 'test@example.com',
      }

      await agent.post('/api/votes').send(firstVote)
      return agent
        .post('/api/votes')
        .send(secondVote)
        .then(res => {
          expect(res.text).toEqual('Your vote has been updated!')
          return Vote.count()
        }).then(count => {
          expect(count).toEqual(1)
        })
    })
  })
})
