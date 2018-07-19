import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createGetVotesThunk } from './store'
import VoteForm from './components/vote-form'

class Main extends Component {

  componentDidMount() {
    this.props.getVotes()
  }

  render() {
    const { frameworks, votes, loading, error } = this.props
    if (frameworks.length === 0 && loading) return <div>Loading...</div> // TODO: add spinner
    if (error) return <div>Oops! An error occurred: {error} </div>

    return (
      <div>
        <h2>Frameworks</h2>
        {
          frameworks.map(framework => (
            <div key={framework.id}>
              <p>{framework.name}</p>
              <p>{framework.stars}</p>
            </div>
          ))
        }
        <h2>Votes</h2>
        {
          votes.map(vote => (
            <div key={vote.name}>
              <p>{vote.name}</p>
              <p>{vote.totalVotes}</p>
            </div>
          ))
        }
      <VoteForm frameworks={frameworks} />
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getVotes: () => dispatch(createGetVotesThunk())
  }
}

const mapStateToProps = state => {
  return {
    frameworks: state.frameworks.data,
    votes: state.frameworks.votes,
    loading: state.frameworks.isFetching,
    error: state.frameworks.error,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
