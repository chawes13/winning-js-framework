const db = require('../server/db')
const { Framework } = require('../server/db/models')

// Used for initializing the frameworks that are eligible (see seed-local.js for sample votes)
async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const frameworks = await Promise.all([
    Framework.create({name: 'React', githubPath: 'facebook/react'}),
    Framework.create({name: 'Angular', githubPath: 'angular/angular.js'}),
    Framework.create({name: 'Ember', githubPath: 'emberjs/ember.js'}),
    Framework.create({name: 'Vue', githubPath: 'vuejs/vue'}),
  ])

  console.log(`seeded ${frameworks.length} frameworks`)
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
