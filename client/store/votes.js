import axios from 'axios'

// actions
const SUBMIT_VOTE = 'SUBMIT_VOTE'
const SUBMIT_VOTE_ERROR = 'SUBMIT_VOTE_ERROR'
const SUBMIT_VOTE_SUCCESS = 'SUBMIT_VOTE_SUCCESS'

// initial state
const initialState = {
  isFetching: false,
  errorMsg: '',
  successMsg: '',
}

// action creators
const createSubmitVoteAction = () => ({type: SUBMIT_VOTE})
const createSubmitVoteErrorAction = (error) => ({type: SUBMIT_VOTE_ERROR, error})
const createSubmitVoteSuccessAction = (message) => ({type: SUBMIT_VOTE_SUCCESS, message})

// thunk creators
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
    case SUBMIT_VOTE:
      return {
        ...state,
        isFetching: true,
        successMsg: '',
      }
    case SUBMIT_VOTE_ERROR:
      return {
        ...state,
        isFetching: false,
        errorMsg: action.error,
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
