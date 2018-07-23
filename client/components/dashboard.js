import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createPostVoteThunk } from '../store'
import FrameworkTable from './framework-table'
import VoteForm from './vote-form'
import { Container, Divider, Message } from 'semantic-ui-react'

class Dashboard extends Component {
  constructor() {
    super()
    this.state = {
      hideFlashMsg: false,
    }
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
      })
    }

    return this.props.submitVote(vote)
  }

  render() {
    const { frameworks, voteError, voteSuccess } = this.props
    return (
      <Container id="dashboard">
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
        <Divider horizontal id="divider">Vote Here!</Divider>
        <VoteForm frameworks={frameworks} handleVote={this.handleVote} />
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    frameworks: state.frameworks.data,
    voteError: state.votes.errorMsg,
    voteSuccess: state.votes.successMsg,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    submitVote: (vote) => dispatch(createPostVoteThunk(vote))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
