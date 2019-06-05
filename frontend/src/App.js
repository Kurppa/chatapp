import React, { useState } from 'react'
import { 
  BrowserRouter as Router,
  Link,
} from 'react-router-dom'
import LoginPage from './components/LoginPage/LoginPage'
import MainView from './components/MainView/MainView'
import { Container, Menu } from 'semantic-ui-react'

const App = () => {
  const [user, setUser] = useState(null)

  //maybe useEffect to autologin here
  const logout = () => {
    setUser(null)
  }

  return (
    <Router>
      <Menu>
        <Menu.Item style={{ fontSize: '20px' }} header as={Link} to='/'>
          ChatApp
        </Menu.Item>
        {
          user ? 
            <Menu.Menu position='right'>
              <Menu.Item
                name='logout'
                onClick={() => logout()}
              />
            </Menu.Menu>
            : null
        }
      </Menu>
      <Container style={ { marginTop: '5rem' } }> 
        {
          user
            ? <MainView />
            : <LoginPage
              setUser={setUser}
            />
        }
      </Container>    
    </Router>
  )
}

export default App
