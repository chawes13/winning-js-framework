import React from 'react'
import { shallow } from 'enzyme'
import VoteForm from './vote-form'

describe('<VoteForm> Component', () => {
  const frameworks = [
    {name: 'React', githubPath: 'facebook/react'},
    {name: 'Angular', githubPath: 'angular/angular.js'},
    {name: 'Ember', githubPath: 'emberjs/ember.js'},
    {name: 'Vue', githubPath: 'vuejs/vue'}
  ]

  test('has a blank initial state', () => {
    const voteForm = shallow(<VoteForm frameworks={frameworks} />)
    expect(voteForm.state().email).toBe('')
    expect(voteForm.state().framework).toBe('')
  })
})
