import React, { Component } from 'react'
import { connect } from 'react-redux'

class VoteForm extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      framework: '',
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    console.log('Form submitted', this.state)
  }

  render() {
    const options = this.props.frameworks.map(framework => framework.name).sort()

    return (
      <form onChange={this.handleChange} onSubmit={this.handleSubmit}>
        <h2>Vote here!</h2>
        <input type="email" name="email" placeholder="sara@example.com" />
        <select name="framework">
          <option value="">--</option>
          {
            options.sort().map(option => (
              <option key={option} value={option}>{option}</option>
            ))
          }
        </select>
        <button type="submit" disabled={!this.state.email || !this.state.framework}>Vote</button>
      </form>
    )
  }
}



export default connect()(VoteForm)
