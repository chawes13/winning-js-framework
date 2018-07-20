import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Button } from 'semantic-ui-react'
import { createPostVoteThunk } from '../store'

const initialState = {
  email: '',
  framework: '',
}

class VoteForm extends Component {
  constructor() {
    super()
    this.state = initialState
  }

  handleChange = (event, { name, value }) => {
    this.setState({
      [name]: value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.submitVote(this.state)
    this.setState(initialState)
  }

  render() {
    const options = this.props.frameworks.map(framework => framework.name).sort().map(option => (
      { key: option, value: option, text: option}
    ))

    return (
      <Form onSubmit={this.handleSubmit}>
        <h2>Vote here!</h2>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            type="email"
            label="Email"
            name="email"
            placeholder="sara@example.com"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <Form.Select
            fluid
            name="framework"
            label="Framework"
            placeholder="Select a Framework"
            options={options}
            value={this.state.framework}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Button type="submit" disabled={!this.state.email || !this.state.framework}>Vote</Button>
      </Form>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    submitVote: (vote) => dispatch(createPostVoteThunk(vote))
  }
}

export default connect(null, mapDispatchToProps)(VoteForm)
