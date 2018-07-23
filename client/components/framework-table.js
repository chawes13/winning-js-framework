import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

class FrameworkTable extends Component {
  constructor() {
    super()
    this.state = {
      column: 'name',
      direction: 'ascending',
    }
  }

  handleSort = (colName) => {
    if (this.state.column === colName) {
      this.setState((prevState) => ({
        direction: prevState.direction === 'ascending' ? 'descending' : 'ascending'
      }))
    } else {
      this.setState({
        column: colName,
        direction: 'ascending',
      })
    }
  }

  sort = (data) => {
    const { column, direction } = this.state
    const sortVal = (direction === 'ascending') ? 1 : -1

    return data.sort((a, b) => {
      if (a[column] > b[column])
        return sortVal
      else if (a[column] < b[column])
        return sortVal * -1
      else
        return 0
    })
  }

  render() {
    const { column, direction } = this.state
    // This will retain the preferred sort order if/when new data is pushed from server
    const sortedData = this.sort(this.props.frameworks.slice())

    return (
      <div id="frameworks-table">
        <h2>Frameworks</h2>
        <Table sortable celled fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === 'name' ? direction : null}
                onClick={() => this.handleSort('name')}
              >
                Name
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'stars' ? direction : null}
                onClick={() => this.handleSort('stars')}
              >
                Stars
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'pullRequests' ? direction : null}
                onClick={() => this.handleSort('pullRequests')}
              >
                Merged Pull Requests (last 7 days)
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'activeIssues' ? direction : null}
                onClick={() => this.handleSort('activeIssues')}
              >
                Updated Issues (last 7 days)
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { sortedData.map(framework => (
                <Table.Row key={framework.name}>
                  <Table.Cell><a href={`https://github.com/${framework.githubPath}`} target="_blank" rel="noopener noreferrer">{framework.name}</a></Table.Cell>
                  <Table.Cell textAlign="right">{framework.stars.toLocaleString()}</Table.Cell>
                  <Table.Cell textAlign="right">{framework.pullRequests.toLocaleString()}</Table.Cell>
                  <Table.Cell textAlign="right">{framework.activeIssues.toLocaleString()}</Table.Cell>
                </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

export default FrameworkTable
