import React from 'react'
import { shallow } from 'enzyme'
import FrameworkTable from './framework-table'

describe('<FrameworkTable> Component', () => {
  const frameworks = [
    {name: 'React', githubPath: 'facebook/react', stars: 1000, pullRequests: 20, activeIssues: 50 },
    {name: 'Angular', githubPath: 'angular/angular.js', stars: 400, pullRequests: 15, activeIssues: 3},
    {name: 'Ember', githubPath: 'emberjs/ember.js', stars: 10, pullRequests: 30, activeIssues: 25},
    {name: 'Vue', githubPath: 'vuejs/vue', stars: 1500, pullRequests: 2, activeIssues: 45}
  ]

  test('initially sorted by name', () => {
    const frameworkTable = shallow(<FrameworkTable frameworks={frameworks} />)
    expect(frameworkTable.state().column).toBe('name')
    expect(frameworkTable.state().direction).toBe('ascending')
  })
})
