import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import Reducer, { createPostVoteThunk } from './votes'

const middlewares = [thunkMiddleware]
const mockStore = configureMockStore(middlewares)

describe('Votes Redux Store', () => {
  describe('Thunks', () => {
    let store
    let mockAxios
    const initialState = {
      data: [],
      isFetching: false,
      errorMsg: '',
      successMsg: '',
    }

    beforeEach(() => {
      mockAxios = new MockAdapter(axios)
      store = mockStore(initialState)
    })

    afterEach(() => {
      mockAxios.restore()
      store.clearActions()
    })

    describe('Post Vote Thunk', () => {
      test('dispatches the SUBMIT_VOTE action', () => {
        mockAxios.onPost('/api/votes').reply(200)
        return store.dispatch(createPostVoteThunk({}))
          .then(() => {
            const actions = store.getActions()
            expect(actions[0].type).toBe('SUBMIT_VOTE')
          })
      })

      test('eventually dispatches the SUBMIT_VOTE_SUCCESS action', () => {
        mockAxios.onPost('/api/votes').reply(200)
        return store.dispatch(createPostVoteThunk({}))
          .then(() => {
            const actions = store.getActions()
            expect(actions[1].type).toBe('SUBMIT_VOTE_SUCCESS')
          })
      })

      test('will dispatch the SUBMIT_VOTE_ERROR action if a problem occurs', () => {
        mockAxios.onPost('/api/votes').reply(500)
        return store.dispatch(createPostVoteThunk({}))
          .then(() => {
            const actions = store.getActions()
            expect(actions[1].type).toBe('SUBMIT_VOTE_ERROR')
          })
      })
    })
  })

  describe('Reducer', () => {
    describe('SUBMIT_VOTE action', () => {
      let initialState
      let newState

      beforeEach(() => {
        initialState = {
          data: [],
          isFetching: false,
          errorMsg: '',
          successMsg: '',
        }

        newState = Reducer(initialState, {
          type: 'SUBMIT_VOTE',
        })
      })

      test('returns a new state indicating that an API call is in progress', () => {
        expect(newState.isFetching).toBe(true)
      })

      test('does not modify the previous state', () => {
        expect(initialState.isFetching).toBe(false)
      })
    })

    describe('SUBMIT_VOTE_SUCCESS action', () => {
      let initialState
      let newState

      beforeEach(() => {
        initialState = {
          data: [],
          isFetching: false,
          errorMsg: '',
          successMsg: '',
        }

        newState = Reducer(initialState, {
          type: 'SUBMIT_VOTE_SUCCESS',
          message: 'Thanks for voting!'
        })
      })

      test('returns a new state with a success message', () => {
        expect(newState.successMsg).toBe('Thanks for voting!')
      })

      test('indicates that it is no longer fetching', () => {
        expect(newState.isFetching).toBe(false)
      })

      test('does not modify the previous state', () => {
        expect(initialState.successMsg).toBe('')
      })
    })

    describe('SUBMIT_VOTE_ERROR action', () => {
      let initialState
      let newState

      beforeEach(() => {
        initialState = {
          data: [],
          isFetching: false,
          errorMsg: '',
          successMsg: '',
        }

        newState = Reducer(initialState, {
          type: 'SUBMIT_VOTE_ERROR',
          error: 'Error'
        })
      })

      test('returns a new state with an error message', () => {
        expect(newState.errorMsg).toBe('Error')
      })

      test('indicates that it is no longer fetching', () => {
        expect(newState.isFetching).toBe(false)
      })

      test('does not modify the previous state', () => {
        expect(initialState.errorMsg).toBe('')
      })
    })
  })
})
