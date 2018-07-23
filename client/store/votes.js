import axios from 'axios'

// actions
const GET_VOTES = 'GET_VOTES'
const GET_VOTES_ERROR = 'GET_VOTES_ERROR'
const GOT_VOTES = 'GOT_VOTES'
const SUBMIT_VOTE = 'SUBMIT_VOTE'
const SUBMIT_VOTE_ERROR = 'SUBMIT_VOTE_ERROR'
const SUBMIT_VOTE_SUCCESS = 'SUBMIT_VOTE_SUCCESS'

// initial state
const initialState = {
  data: [],
  isFetching: false,
  errorMsg: '',
  successMsg: '',
}

// action creators
const createGetVotesAction = () => ({type: GET_VOTES})
const createGetVotesErrorAction = (error) => ({type: GET_VOTES_ERROR, error})
const createGotVotesAction = (votes) => ({type: GOT_VOTES, votes})
const createSubmitVoteAction = () => ({type: SUBMIT_VOTE})
const createSubmitVoteErrorAction = (error) => ({type: SUBMIT_VOTE_ERROR, error})
const createSubmitVoteSuccessAction = (message) => ({type: SUBMIT_VOTE_SUCCESS, message})

// thunk creators
export const createGetVotesThunk = () => {
  return async dispatch => {
    try {
      dispatch(createGetVotesAction())
      const {data: votes} = await axios.get('/api/votes')
      dispatch(createGotVotesAction(votes))
    } catch (error) {
      dispatch(createGetVotesErrorAction(error.message))
    }
  }
}

export const createPostVoteThunk = (vote) => {
  return async dispatch => {
    try {
      dispatch(createSubmitVoteAction())
      const {data: message} = await axios.post('/api/votes', vote)
      dispatch(createSubmitVoteSuccessAction(message))
      return true
    } catch (error) {
      dispatch(createSubmitVoteErrorAction(error.message))
    }
  }
}

// reducer
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_VOTES:
      return {
        ...state,
        isFetching: true,
      }
    case SUBMIT_VOTE:
      return {
        ...state,
        isFetching: true,
        successMsg: '',
      }
    case GET_VOTES_ERROR:
    case SUBMIT_VOTE_ERROR:
      return {
        ...state,
        isFetching: false,
        errorMsg: action.error,
      }
    case GOT_VOTES:
      return {
        ...state,
        data: action.votes,
        isFetching: false,
        errorMsg: '',
      }
    case SUBMIT_VOTE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMsg: '',
        successMsg: action.message,
      }
    default:
      return state
  }
}
