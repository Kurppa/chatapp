import React, { useState } from 'react'
import { 
  BrowserRouter as Router,
  Link,
} from 'react-router-dom'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import { LOGOUT } from './graphql/mutations'
import LoginPage from './components/LoginPage/LoginPage'
import MainView from './components/MainView/MainView'
import { Container, Menu } from 'semantic-ui-react'

const App = () => {
  const [user, setUser] = useState(null)
  const [logout] = useMutation(LOGOUT)

  const client = useApolloClient()

  //maybe useEffect to autologin here
  
  const logoutHandler = () => {
    logout()
    client.clearStore()
    setUser(null)
  }

  return (
    <Router>
      <Container>
        <Menu >
          <Menu.Item style={{ fontSize: '20px' }} header as={Link} to='/'>
          ChatApp
          </Menu.Item>
          {
            user ? 
              <Menu.Menu position='right'>
                <Menu.Item
                  name='logout'
                  onClick={() => logoutHandler()}
                />
              </Menu.Menu>
              : null
          }
        </Menu>
       
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
