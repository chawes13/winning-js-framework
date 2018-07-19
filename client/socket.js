import io from 'socket.io-client'
import store, { createGotFrameworksAction, createGotUpdatedFrameworksAction } from './store'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')
})

socket.on('server:initial-data', data => {
  store.dispatch(createGotFrameworksAction(data))
})

socket.on('server:new-data', data => {
  store.dispatch(createGotUpdatedFrameworksAction(data))
})

export default socket
