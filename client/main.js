import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createGetVotesThunk, createGetFrameworksThunk } from './store'
import VoteForm from './components/vote-form'
import FrameworkTable from './components/framework-table'
import { Container, Dimmer, Loader } from 'semantic-ui-react'

class Main extends Component {

  componentDidMount() {
    // this.props.getVotes()
    this.props.getInitialFrameworks()
  }

  render() {
    const { frameworks, votes, loading, error } = this.props
    if (error) return <div>Oops! An error occurred: {error} </div>
    // TODO: refactor the store to have isFetching separated for votes and frameworks
    if (frameworks.length === 0 || loading) return (
      <div>
        <Dimmer active inverted>
          <Loader inverted content="Loading..." />
        </Dimmer>
      </div>
    )


    return (
      <Container>
        <h2>Frameworks</h2>
          <FrameworkTable frameworks={frameworks} />
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
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getVotes: () => dispatch(createGetVotesThunk()),
    getInitialFrameworks: () => dispatch(createGetFrameworksThunk())
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
