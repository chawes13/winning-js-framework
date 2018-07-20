import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

class FrameworkTable extends Component {
  constructor() {
    super()
    this.state = {
      column: null,
      direction: null,
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
    if (direction === 'ascending') {
      return data.sort((a, b) => a[column] > b[column])
    } else {
      return data.sort((a, b) => a[column] < b[column])
    }
  }

  render() {
    const { column, direction } = this.state
    // This will retain the preferred sort order if/when new data is pushed from server
    const sortedData = this.sort(this.props.frameworks)

    return (
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
              sorted={column === 'pull-requests' ? direction : null}
              onClick={() => this.handleSort('pull-requests')}
            >
              Pull Requests
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'issues' ? direction : null}
              onClick={() => this.handleSort('issues')}
            >
              Issues
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { sortedData.map(framework => (
              <Table.Row key={framework.name}>
                <Table.Cell>{framework.name}</Table.Cell>
                <Table.Cell>{framework.stars}</Table.Cell>
                <Table.Cell>{framework['pull-requests']}</Table.Cell>
                <Table.Cell>{framework.issues}</Table.Cell>
              </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }
}

export default FrameworkTable
