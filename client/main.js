import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createGetFrameworksThunk, createPostVoteThunk } from './store'
import VoteForm from './components/vote-form'
import FrameworkTable from './components/framework-table'
import Navbar from './components/navbar'
import { Container, Dimmer, Message, Loader } from 'semantic-ui-react'

class Main extends Component {

  constructor() {
    super()
    this.state = {
      hideFlashMsg: false,
    }
  }

  componentDidMount() {
    this.props.getInitialFrameworks()
  }

  handleDismiss = () => {
    this.setState({
      hideFlashMsg: true,
    })
  }

  handleVote = (vote) => {
    if (this.state.hideFlashMsg) {
      this.setState({
        hideFlashMsg: false,
      }, () => this.props.submitVote(vote))
    } else {
      return this.props.submitVote(vote)
    }
  }

  render() {
    const { frameworks, frameworksLoading, frameworksError, voteError, voteSuccess } = this.props
    if (frameworksError) return <div>Oops! An error occurred: {frameworksError} </div>
    if (frameworks.length === 0 && frameworksLoading) return (
      <div>
        <Dimmer active inverted>
          <Loader inverted content="Loading..." />
        </Dimmer>
      </div>
    )

    return (
      <Container>
        <Navbar />
        <div id="dashboard">
          { (!!voteError && !this.state.hideFlashMsg) && (
            <Message
              negative
              icon="exclamation triangle"
              header="Vote Unsuccessful"
              content={`Your vote failed for the following reason: ${voteError}`}
              onDismiss={this.handleDismiss}
            />
          )}
          { (!!voteSuccess && !this.state.hideFlashMsg) && (
            <Message
              positive
              icon="check circle outline"
              header="Vote Recorded"
              content={voteSuccess}
              onDismiss={this.handleDismiss}
            />
          )}
          <FrameworkTable frameworks={frameworks} />
          <VoteForm frameworks={frameworks} handleVote={this.handleVote} />
        </div>
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getInitialFrameworks: () => dispatch(createGetFrameworksThunk()),
    submitVote: (vote) => dispatch(createPostVoteThunk(vote))
  }
}

const mapStateToProps = state => {
  return {
    frameworks: state.frameworks.data,
    frameworksLoading: state.frameworks.isFetching,
    frameworksError: state.frameworks.errorMsg,
    voteError: state.votes.errorMsg,
    voteSuccess: state.votes.successMsg,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
