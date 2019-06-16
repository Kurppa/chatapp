import React, { useState } from 'react'
import {
  Route,
  Switch, 
  withRouter,
  Link,
} from 'react-router-dom'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import { LOGOUT } from './graphql/mutations'
import LoginPage from './components/LoginPage/LoginPage'
import MainView from './components/MainView/MainView'
import { Container, Menu } from 'semantic-ui-react'

const App = (props) => {
  const [user, setUser] = useState(null)
  const [logout] = useMutation(LOGOUT)

  const client = useApolloClient()

  //maybe useEffect to autologin here
  
  const logoutHandler = () => {
    logout()
    client.clearStore()
    setUser(null)
    props.history.push('/')
  }

  return (
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
      <Switch>
        <Route exact path='/user' render={() => (
          <MainView setUser={setUser} />
        )} />
        <Route path='/' render={() => (
          <LoginPage />
        )} />
      </Switch>
    </Container>
       
  )
}

export default withRouter(App)
