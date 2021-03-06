import io from 'socket.io-client'
import store, { createGotUpdatedFrameworksAction } from './store'

const socket = io(window.location.origin)

socket.on('server:new-data', data => {
  store.dispatch(createGotUpdatedFrameworksAction(data))
})

export default socket
