import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import Reducer, { createGetFrameworksThunk } from './frameworks'

const middlewares = [thunkMiddleware]
const mockStore = configureMockStore(middlewares)

describe('Frameworks Redux Store', () => {
  describe('Thunks', () => {
    let store
    let mockAxios
    const initialState = {
      data: [],
      isFetching: false,
      errorMsg: ''
    }

    beforeEach(() => {
      mockAxios = new MockAdapter(axios)
      store = mockStore(initialState)
    })

    afterEach(() => {
      mockAxios.restore()
      store.clearActions()
    })

    describe('Get Frameworks Thunk', () => {
      const frameworkResponse = [
        {name: 'React', githubPath: 'facebook/react'},
        {name: 'Angular', githubPath: 'angular/angular.js'},
        {name: 'Ember', githubPath: 'emberjs/ember.js'},
        {name: 'Vue', githubPath: 'vuejs/vue'}
      ]

      test('dispatches the GET_FRAMEWORKS action', () => {
        mockAxios.onGet('/api/frameworks').reply(200, frameworkResponse)
        return store.dispatch(createGetFrameworksThunk())
          .then(() => {
            const actions = store.getActions()
            expect(actions[0].type).toBe('GET_FRAMEWORKS')
          })
      })

      test('eventually dispatches the GOT_FRAMEWORKS action', () => {
        mockAxios.onGet('/api/frameworks').reply(200, frameworkResponse)
        return store.dispatch(createGetFrameworksThunk())
          .then(() => {
            const actions = store.getActions()
            expect(actions[1].type).toBe('GOT_FRAMEWORKS')
          })
      })

      test('dispatches the GET_FRAMEWORKS_ERROR when a problem occurs', () => {
        mockAxios.onGet('/api/frameworks').reply(500)
        return store.dispatch(createGetFrameworksThunk())
          .then(() => {
            const actions = store.getActions()
            expect(actions[1].type).toBe('GET_FRAMEWORKS_ERROR')
          })
      })
    })
  })

  describe('Reducer', () => {
    describe('GET_FRAMEWORKS action', () => {
      let initialState
      let newState

      beforeEach(() => {
        initialState = {
          data: [],
          isFetching: false,
          errorMsg: ''
        }
        newState = Reducer(initialState, {
          type: 'GET_FRAMEWORKS',
        })
      })

      test('returns a new state indicating that an API call is in progress', () => {
        expect(newState.isFetching).toBe(true)
      })

      test('does not modify previous state', () => {
        expect(initialState.isFetching).toBe(false)
      })
    })

    describe('GOT_FRAMEWORKS action', () => {
      const frameworksData = [
        {name: 'React', githubPath: 'facebook/react'},
        {name: 'Angular', githubPath: 'angular/angular.js'},
        {name: 'Ember', githubPath: 'emberjs/ember.js'},
        {name: 'Vue', githubPath: 'vuejs/vue'}
      ]
      let initialState
      let newState

      beforeEach(() => {
        initialState = {
          data: [],
          isFetching: false,
          errorMsg: ''
        }
        newState = Reducer(initialState, {
          type: 'GOT_FRAMEWORKS',
          frameworks: frameworksData,
        })
      })

      test('returns a new state with frameworks', () => {
        expect(newState.data).toEqual(frameworksData)
      })

      test('indicates that it is no longer fetching', () => {
        expect(newState.isFetching).toBe(false)
      })

      test('does not have an error message', () => {
        expect(newState.errorMsg).toBe('')
      })

      test('does not modify the previous state', () => {
        expect(initialState.data).toEqual([])
      })
    })

    describe('GOT_UPDATED_FRAMEWORKS action', () => {
      const frameworksData = [
        {name: 'React', githubPath: 'facebook/react', stars: 3},
        {name: 'Angular', githubPath: 'angular/angular.js', stars: 2},
        {name: 'Ember', githubPath: 'emberjs/ember.js', stars: 4},
        {name: 'Vue', githubPath: 'vuejs/vue', stars: 1}
      ]
      const updatedFrameworksData = [
        {name: 'React', githubPath: 'facebook/react', stars: 10},
        {name: 'Angular', githubPath: 'angular/angular.js', stars: 2},
        {name: 'Ember', githubPath: 'emberjs/ember.js', stars: 4},
        {name: 'Vue', githubPath: 'vuejs/vue', stars: 1}
      ]
      let initialState
      let newState

      beforeEach(() => {
        initialState = {
          data: frameworksData,
          isFetching: false,
          errorMsg: ''
        }
        newState = Reducer(initialState, {
          type: 'GOT_UPDATED_FRAMEWORKS',
          frameworks: updatedFrameworksData,
        })
      })

      test('returns a new state with frameworks', () => {
        expect(newState.data).toEqual(updatedFrameworksData)
      })

      test('indicates that it is no longer fetching', () => {
        expect(newState.isFetching).toBe(false)
      })

      test('does not have an error message', () => {
        expect(newState.errorMsg).toBe('')
      })

      test('does not modify the previous state', () => {
        expect(initialState.data).toEqual(frameworksData)
      })
    })

    describe('GET_FRAMEWORKS_ERROR action', () => {
      let initialState
      let newState

      beforeEach(() => {
        initialState = {
          data: [],
          isFetching: false,
          errorMsg: ''
        }
        newState = Reducer(initialState, {
          type: 'GET_FRAMEWORKS_ERROR',
          error: '500: Network error!'
        })
      })

      test('returns a new state with an error message', () => {
        expect(newState.errorMsg).toBeTruthy()
      })

      test('indicates that it is no longer fetching', () => {
        expect(newState.isFetching).toEqual(false)
      })

      test('does not modify the previous state', () => {
        expect(initialState.errorMsg).toBe('')
      })
    })
  })
})
