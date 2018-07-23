import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createGetFrameworksThunk } from './store'
import Dashboard from './components/dashboard'
import Navbar from './components/navbar'
import { Dimmer, Loader } from 'semantic-ui-react'

class Main extends Component {

  componentDidMount() {
    this.props.getInitialFrameworks()
  }

  render() {
    const { frameworks, frameworksLoading, frameworksError } = this.props
    if (frameworksError) return <div>Oops! An error occurred: {frameworksError} </div>
    if (frameworks.length === 0 && frameworksLoading) return (
      <div>
        <Dimmer active inverted>
          <Loader inverted content="Loading..." />
        </Dimmer>
      </div>
    )

    return (
      <div>
        <Navbar />
        <Dashboard />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    frameworks: state.frameworks.data,
    frameworksLoading: state.frameworks.isFetching,
    frameworksError: state.frameworks.errorMsg,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getInitialFrameworks: () => dispatch(createGetFrameworksThunk()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
