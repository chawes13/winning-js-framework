import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'

const Navbar = () => {
  return (
    <div>
      <Menu id="navbar" fixed="top" size="huge" inverted borderless>
        <Menu.Item header>
          <Icon name="rocket" />
          JS Framework Activity
        </Menu.Item>
      </Menu>
    </div>
  )
}

export default Navbar
