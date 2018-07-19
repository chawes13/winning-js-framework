import axios from 'axios'

// action types
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
export const createGotFrameworksAction = (frameworks) => ({type: GOT_FRAMEWORKS, frameworks})
export const createGotUpdatedFrameworksAction = (frameworks) => ({type: GOT_UPDATED_FRAMEWORKS, frameworks})
const createGetVotesAction = () => ({type: GET_VOTES})
const createGetVotesErrorAction = (error) => ({type: GET_VOTES_ERROR, error})
const createGotVotesAction = (votes) => ({type: GOT_VOTES, votes})

// thunk creators

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

// reducer
export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_FRAMEWORKS:
    case GOT_UPDATED_FRAMEWORKS:
      return {
        ...state,
        isFetching: false,
        error: '',
        data: action.frameworks,
      }
    case GET_VOTES:
      return {
        ...state,
        isFetching: true,
      }
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
