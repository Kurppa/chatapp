import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'

import { useMutation } from '@apollo/react-hooks'
import { REGISTER } from '../../graphql/mutations'

import { Button, Form, Header, Grid, Segment } from 'semantic-ui-react'

const RegisterForm = (props) => {
  const [username, setUsername ] = useState('')
  const [password, setPassword ] = useState('')
  const [rePassword, setRePassword ] = useState('')

  const [register, { error, data }]= useMutation(REGISTER)

  const submit = async (event) => {
    event.preventDefault()
    if ( username.length < 1 || password.length < 1) {
      props.setMessage({
        message: 'Please fill all fields', 
        status: 'error'
      })
    } else {
      if ( password !== rePassword) {
        props.setMessage({
          message: 'passwords don\'t match',
          status: 'error'
        })
      } else {
        try {
          await register({
            variables: { username, password },
          })
          setUsername('')
          setPassword('')
          setRePassword('')
          props.history.push('/')
          props.setMessage({
            status: 'success',
            message: 'User created succesfully'
          })
        } catch (e) {
          console.log(e)
          props.graphqlError(e)
        }
  
      }    
    }

  }

  return (
    <Grid centered columns={2}>
      <Grid.Column>
        <Header as='h1' textAlign='center'>
          Register
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
            <Form.Field>
              <label>Confirm password</label>
              <input type='password' value={rePassword} onChange={({ target }) => setRePassword(target.value)} />
            </Form.Field>
            <Button color='green' type='submit'>Register</Button>
          </Form>
        </Segment>
      </Grid.Column>
      
    </Grid>
  )

} 

export default withRouter(RegisterForm)