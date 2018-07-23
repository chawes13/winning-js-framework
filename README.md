# "Winning" JavaScript Framework
The purpose of this application is to facilitate the comparison and selection of the "winning" JavaScript client-side framework for a project based on GitHub activity. Users can view and sort popular JavaScript frameworks based on total Stars and weekly Merged Pull Requests and Updated Issues to get a sense for each framework's development activity, community support, and stability. Once a user has made their decision, they can submit their vote for the "winning" JavaScript framework.

[View Deployed Application](https://winning-js-framework.herokuapp.com/)

## Getting Started
1. Fork or clone this [repo](https://github.com/chawes13/winning-js-framework.git)
1. Install dependencies using `npm install`
1. Create two Postgres databases: `winning-framework` and `winning-framework-test`
1. Create a [personal access token](https://github.com/settings/tokens) that has access to public repositories
1. Create a file called `secrets.js` in the project's root and populate it with the following:

   ```
   process.env.SESSION_SECRET = 'abc' // your darkest secret (or anything, really)
   process.env.GITHUB_TOKEN = 'xyz' // your GitHub token generated above
   process.env.GITHUB_API_INTERVAL = 30000 // time (in ms) between API calls with at least 1 user connected
   process.env.GITHUB_API_MAX_INTERVAL = 900000 // maximum time (in ms) betweeen API calls
   ```
1. Run tests with `npm test` or `npm run test-watch`
1. Seed the DB with the appropriate frameworks using `npm run seed`
1. Start the application using `npm run start-dev`
1. Vote on your favorite JavaScript framework!

## Technologies
* [Semantic UI React](https://react.semantic-ui.com/introduction)
* [React](https://reactjs.org/docs/getting-started.html) with [Redux](https://redux.js.org/basics/usage-with-react)
* [Node.js](https://nodejs.org/en/docs/)
* [Express](https://expressjs.com/en/4x/api.html)
* [Socket.io](https://socket.io/docs/)
* [Sequelize](http://docs.sequelizejs.com/manual/installation/getting-started.html)
* [PostgreSQL](https://www.postgresql.org/docs/)
* [Jest](https://jestjs.io/docs/en/getting-started)
* [Enzyme](http://airbnb.io/enzyme/)

## Requirements
**Create a dashboard that can be sorted for the following frameworks: React, Angular, Ember, and Vue.**

**Show updates to the the dashboard without a page refresh.**

**Display the 3 most relevant pieces of information.**

**Capture a single vote for a given framework per user email address and browser session.**

**Expose the tally of total votes for each framework via a single API route.**
