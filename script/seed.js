const db = require('../server/db')
const { Framework, Vote } = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const frameworks = await Promise.all([
    Framework.create({name: 'React', githubPath: 'facebook/react'}),
    Framework.create({name: 'Angular', githubPath: 'angular/angular.js'}),
    Framework.create({name: 'Ember', githubPath: 'emberjs/ember.js'}),
    Framework.create({name: 'Vue', githubPath: 'vuejs/vue'}),
  ])

  const votes = await Promise.all([
    Vote.create({email: 'react@email.com', sessionId: '1', frameworkId: 1}),
    Vote.create({email: 'angular@email.com', sessionId: '2', frameworkId: 2}),
    Vote.create({email: 'ember@email.com', sessionId: '3', frameworkId: 3}),
    Vote.create({email: 'vue@email.com', sessionId: '4', frameworkId: 1}),
    Vote.create({email: 'redux@email.com', sessionId: '5', frameworkId: 1}),
  ])

  console.log(`seeded ${frameworks.length} frameworks`)
  console.log(`seeded ${votes.length} votes`)
  console.log(`seeding completed`)
}

async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  } finally {
    console.log('closing db connection...')
    await db.close()
    console.log('db connection closed')
  }
}

runSeed()
