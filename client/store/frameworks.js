import axios from 'axios'

// action types
const GET_FRAMEWORKS = 'GET_FRAMEWORKS'
const GET_FRAMEWORKS_ERROR = 'GET_FRAMEWORKS_ERROR'
const GOT_FRAMEWORKS = 'GOT_FRAMEWORKS'
const GOT_UPDATED_FRAMEWORKS = 'GOT_UPDATED_FRAMEWORKS'
const GET_VOTES = 'GET_VOTES'
const GET_VOTES_ERROR = 'GET_VOTES_ERROR'
const GOT_VOTES = 'GOT_VOTES'

// initial state
const initialState = {
  data: [],
  votes: [],
  isFetching: false,
  errorMsg: ''
}

// action creators
const createGetFrameworksAction = () => ({type: GET_FRAMEWORKS})
const createGetFrameworksErrorAction = (error) => ({type: GET_FRAMEWORKS_ERROR, error})
export const createGotFrameworksAction = (frameworks) => ({type: GOT_FRAMEWORKS, frameworks})
export const createGotUpdatedFrameworksAction = (frameworks) => ({type: GOT_UPDATED_FRAMEWORKS, frameworks})
const createGetVotesAction = () => ({type: GET_VOTES})
const createGetVotesErrorAction = (error) => ({type: GET_VOTES_ERROR, error})
const createGotVotesAction = (votes) => ({type: GOT_VOTES, votes})

// thunk creators
export const createGetFrameworksThunk = () => {
  return async dispatch => {
    try {
      dispatch(createGetFrameworksAction())
      const {data: frameworks} = await axios.get('/api/frameworks')
      dispatch(createGotFrameworksAction(frameworks))
    } catch (error) {
      console.error(error)
      dispatch(createGetFrameworksErrorAction(error.message))
    }
  }
}

export const createGetVotesThunk = () => {
  return async dispatch => {
    try {
      dispatch(createGetVotesAction())
      const {data: votes} = await axios.get('/api/votes')
      dispatch(createGotVotesAction(votes))
    } catch (error) {
      console.error(error)
      dispatch(createGetVotesErrorAction(error.message))
    }
  }
}

export const createPostVoteThunk = (vote) => {
  return async dispatch => {
    try {
      const {data: response} = await axios.post('/api/votes', vote)
      // TODO: Refactor to separate store and update store to capture response
      dispatch(createGetVotesThunk())
    } catch (error) {
      console.error(error)
    }
  }
}

// reducer
export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_FRAMEWORKS:
    case GOT_UPDATED_FRAMEWORKS:
      return {
        ...state,
        isFetching: false,
        errorMsg: '',
        data: action.frameworks,
      }
    case GET_FRAMEWORKS:
    case GET_VOTES:
      return {
        ...state,
        isFetching: true,
      }
    case GET_FRAMEWORKS_ERROR:
    case GET_VOTES_ERROR:
      return {
        ...state,
        isFetching: false,
        errorMsg: action.error,
      }
    case GOT_VOTES:
      return {
        ...state,
        votes: action.votes,
        isFetching: false,
        errorMsg: '',
      }
    default:
      return state
  }
}
