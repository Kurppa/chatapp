import React, { useState, useEffect }  from 'react'
import { Route } from 'react-router-dom'

import { renderMessage } from '../../utilities/message'

import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { Segment, Message } from 'semantic-ui-react'

const LoginPage = ({ setUser }) => {
  const [message, setMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(false)

  useEffect(() => {
    const info = window.localStorage.getItem('infoMessages')
    if (info !== 'false') {
      setInfoMessage(true)
    }
  }, [])

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

  const turnOfInfo = () => {
    setInfoMessage(false)
    window.localStorage.setItem('infoMessages', 'false')    
  }

  return (
    <Segment >
      {
        infoMessage ? <Message
          warning
          onDismiss={turnOfInfo}
        >
          <Message.Header>
          Important
          </Message.Header>
          <p>
          Do not use this site for secure communications as it is in development stage.
          </p>
          <p>
          We also store cookies. Cookies are used only for providing secure means of authentication.
          </p>
        </Message> 
          : null  
      }
      
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