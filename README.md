# "Winning" JavaScript Framework [![Build Status](https://travis-ci.org/chawes13/winning-js-framework.svg?branch=master)](https://travis-ci.org/chawes13/winning-js-framework)
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
   process.env.GITHUB_API_MAX_INTERVAL = 900000 // maximum time (in ms) between API calls
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
* [GitHub REST API (v3)](https://developer.github.com/v3/)
* [Socket.io](https://socket.io/docs/)
* [Sequelize](http://docs.sequelizejs.com/manual/installation/getting-started.html)
* [PostgreSQL](https://www.postgresql.org/docs/)
* [Jest](https://jestjs.io/docs/en/getting-started)
* [Enzyme](http://airbnb.io/enzyme/)

## Requirements
**Create a dashboard that can be sorted for the following frameworks: React, Angular, Ember, and Vue.**

The data presented on the dashboard is retrieved from the database via a Redux thunk after the main component first mounts. Given the fluid JavaScript ecosystem, it is entirely possible for a framework to come in or out-of fashion in a relatively short period of time. Since framework information is pulled dynamically from the database, the application can easily be extended in the future to add/remove JavaScript frameworks.

To display the frameworks and their associated data in a sortable table, I used the Semantic UI React library of React Higher-Order Components. By default, the table is sorted alphabetically by name in ascending order. If the user clicks the table header for the column that is currently sorted (indicated by presence of an arrow icon), then the direction of the sort will flip (indicated by the direction of the arrow icon). Clicking on another header will by default sort the column in ascending order, which can be changed to descending with another click. If more frameworks and data points for comparison are added, this feature could be extended to allow for combined sorting (e.g., sort by name ASC, then stars DESC) and React Router could be added to facilitate url matching to share the hyperlink with other users.
   
**Display the 3 most relevant pieces of information.**

In reality, choosing the "winning" JavaScript framework for a project, team, and/or client requires a significant amount of context. Luckily, the JavaScript community has some really talented individuals and committed organizations contributing to open source client-side frameworks such that there really is no "loser" amongst the four nominated frameworks. However, to get a quick sense for how active development is and the amount of community involvement for a particular framework, I decided to use the following pieces of information: 
1. Stars 
  
   **Rationale**: Highlights the number of individuals who "like" a particular framework. This is a very common way to indicate interest on GitHub and tends to change several times throughout the course of an hour.
   
   `GET https://api.github.com/repos`
     
1. Merged Pull Requests (past 7 days)

   **Rationale**: Gives a sense for how active development is on the framework. This was chosen in favor of commits or lines added/removed as the former could vary significantly based on developer personality and the latter could also vary significantly based on organization code formatting requirements and additional configuration files (e.g., package-lock.json or SVGs).
   
   `GET https://api.github.com/search/issues?q=type:pr`
  
1. Updated Issues (past 7 days)

   **Rationale**: Gives a sense for the level of community support and involvement for a framework. Issues that are opened, closed, or commented on indicate not only that individuals are using the framework, but also that they are actively working with the contributors (or contributing themselves) to improve it.
   
   `GET https://api.github.com/search/issues?q=type:issue`

In addition to the criteria above, I think that weekly downloads is a decent heuristic for how popular development is _with_ a particular framework. Since GitHub's API does not expose Dependency Graph insight calculations, this application could be extended to use npm's registry API to include this information alongside the criteria enumerated above.

**Show updates to the the dashboard without a page refresh.**

Live updates from the GitHub API are emitted to all connected clients using websockets powered by `socket.io`. When a client receives a `server:new-data` message, it dispatches an action to the Redux store which updates the data held in state and re-renders the dashboard components with the updated information. As a result, a user does not have to refresh their page to see the most up-to-date information for these selected frameworks.

I implemented the API calls using `setTimeout` with two different intervals: one for when at least one client is connected and one for the maximum allowable interval. This design decision was informed by the fact that the information presented is not critical enough to warrant truly "live" updates on a second-by-second basis and also to mitigate GitHub's API rate limiting. If at least one client is connected, then the GitHub API will be polled at frequent intervals (defaulted to 15 seconds). Otherwise, the API will eventually be polled when a max interval (defaulted to 15 minutes) is reached to ensure that the application data does not become too stale.

As mentioned previously, this functionality was built with extensibility in mind, so frameworks that are added to the `frameworks` table will be included in the API queries without having to modify the socket business logic. Depending on the number of frameworks added, the application will start to quickly hit-up against GitHub's API rate limiting but that is out of the current scope of this project.

An alternative approach that I considered was to use in-memory caching for the `GET /api/frameworks` route and have clients poll the API at a specified interval. Ultimately I decided to implement the API polling on the server side to reduce the load on each client. Additionally, I decided to store the information in a database instead of a cache to account for situations where the GitHub API is inaccessible (either as a result of rate limiting or an internal error).

**Capture a single vote for a given framework per user email address and browser session.**

A vote is submitted via a Redux thunk that makes an http request to the `POST /api/votes` route. By using the `express-session` npm package, browser session id information is included on the request object. The application uses this session id and the submitted email and framework choice to either find or create a vote record in the `votes` table. If a particular email and browser session has already voted for a framework, then the business logic will check to see if the vote has changed and will update the existing vote accordingly. Otherwise, a new vote will be created with that user's selected framework. A user will be informed of the result of their submission by a dismissable flash message rendered at the top of the dashboard.

**Expose the tally of total votes for each framework via a single API route.**

This information is available via `GET /api/votes`. It will return a JSON with an array of objects containing the framework name and total votes, in descending order by vote count. This was accomplished using a single Sequelize findAll operation that queries the Framework table with a `LEFT OUTER JOIN` on the results of a `COUNT(*)` by frameworkId subquery on the `votes` table. 

#### Sample output:
```JSON
[
  {
    "name": "React",
    "totalVotes": "3"
  },
  {
    "name": "Angular",
    "totalVotes": "2"
  },
  {
    "name": "Ember",
    "totalVotes": "2"
  },
  {
    "name": "Vue",
    "totalVotes": "0"
  }
]
```
