import axios from 'axios'

// action types
const GET_FRAMEWORKS = 'GET_FRAMEWORKS'
const GET_FRAMEWORKS_ERROR = 'GET_FRAMEWORKS_ERROR'
const GOT_FRAMEWORKS = 'GOT_FRAMEWORKS'
const GOT_UPDATED_FRAMEWORKS = 'GOT_UPDATED_FRAMEWORKS'

// initial state
const initialState = {
  data: [],
  isFetching: false,
  errorMsg: ''
}

// action creators
const createGetFrameworksAction = () => ({type: GET_FRAMEWORKS})
const createGetFrameworksErrorAction = (error) => ({type: GET_FRAMEWORKS_ERROR, error})
export const createGotFrameworksAction = (frameworks) => ({type: GOT_FRAMEWORKS, frameworks})
export const createGotUpdatedFrameworksAction = (frameworks) => ({type: GOT_UPDATED_FRAMEWORKS, frameworks})

// thunk creators
export const createGetFrameworksThunk = () => {
  return async dispatch => {
    try {
      dispatch(createGetFrameworksAction())
      const {data: frameworks} = await axios.get('/api/frameworks')
      dispatch(createGotFrameworksAction(frameworks))
    } catch (error) {
      dispatch(createGetFrameworksErrorAction(error.message))
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
      return {
        ...state,
        isFetching: true,
      }
    case GET_FRAMEWORKS_ERROR:
      return {
        ...state,
        isFetching: false,
        errorMsg: action.error,
      }
    default:
      return state
  }
}
