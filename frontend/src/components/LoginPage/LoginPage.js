import React, { useState }  from 'react'
import { Route } from 'react-router-dom'

import { renderMessage } from '../../utilities/message'

import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { Segment } from 'semantic-ui-react'

const LoginPage = ({ setUser }) => {
  const [message, setMessage] = useState(null)
  
  const handleMessage = ({ message, status }) => {
    setMessage({ message: message, status: status })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }  

  const graphqlError = (error) => {
    handleMessage({ 
      message: error.graphQLErrors[0].message,
      status: 'error',
    })
  }

  return (
    <Segment >
      { 
        message ? 
          renderMessage(message)
          : null
      }
      <Route exact path='/' render={() => (
        <LoginForm 
          setUser={setUser}
          setMessage={handleMessage}
          graphqlError={graphqlError}
        />
      )} />
      <Route exact path='/register' render={() => (
        <RegisterForm 
          setMessage={handleMessage}
          graphqlError={graphqlError}
        />
      )} />
    </Segment>
  )
}

export default LoginPage
