import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { LOGIN } from '../../graphql/mutations'
import { Link } from 'react-router-dom'
import { Button, Form, Grid, Segment, Header, Message } from 'semantic-ui-react'

const LoginForm = (props) => {
  const [username, setUsername ] = useState('')
  const [password, setPassword ] = useState('')

  const [login] = useMutation(LOGIN)
  
  const submit = async (event) => {
    event.preventDefault()

    try {
      await login({
        variables: { username, password },
      })
      props.history.push('/user') 
    } catch (e) {
      props.graphqlError(e)
    }

  }

  return (
    <Grid centered columns={2}>
      <Grid.Column>
        <Header as='h1' textAlign='center'>
          Login
        </Header>
        <Segment>
          <Form size='large' onSubmit={submit}>
            <Form.Field>
              <label>Username</label>
              <input value={username} onChange={({ target }) => setUsername(target.value)} />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input type='password' value={password} onChange={({ target }) => setPassword(target.value)} />
            </Form.Field>
            <Button color='blue' type='submit'>Login</Button>
          </Form>          
        </Segment>
        <Message>
          <Link to='/register'>Register</Link>
        </Message>
      </Grid.Column>      
    </Grid>
    
  )

} 

export default withRouter(LoginForm)
