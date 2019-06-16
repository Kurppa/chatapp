import React, { useState } from 'react'

import { useMutation, useQuery } from '@apollo/react-hooks'
import { ADD_FRIEND } from '../../../graphql/mutations'
import { USER_DATA, FIND_USER } from '../../../graphql/queries'

import { Segment, Input, Label, Loader, Dimmer, Header } from 'semantic-ui-react'

const Add = () => {
  const [ value, setValue ] = useState('')

  const { data, loading } = useQuery(FIND_USER, { variables: { searchterm: value } })  

  const [ addFriend ] = useMutation(ADD_FRIEND, {
    refetchQueries: [{ query: USER_DATA }]
  })

  const handleSearchChange = (e, { value } ) => {
    e.preventDefault()
    setValue(value)
  }

  const addFriendCaller = (e) => {
    e.preventDefault()
    if (value)
      addFriend({ variables: { id: data.findUser.id } })
    setValue('')
  }
  
  const renderResult = () => {
    if (loading) {
      return (
        <Segment>
          <Dimmer ininverted active>
            <Loader />
          </Dimmer>
        </Segment>
      )
    } else if (data.findUser) {
      return (
        <Segment onClick={ addFriendCaller } style={{ width: '100%' }}>
          { 
            <Header as='h3' key={data.findUser.id}>{data.findUser.username}</Header>
          }
        </Segment>
      )
    } else {
      return (
        <Segment>
          <Header as='h3'>Nothing found</Header>
        </Segment>
      )
    }
  }

  return (
    <>
    <Segment style={{ width: '100%', padding: '1em', verticalAlign: 'middle'   }}>
      <Label color='blue' horizontal size='massive'>Find user: </Label>
      <Input value={value} onChange={handleSearchChange} />
    </Segment>
      {
        value !== '' ? renderResult() : null 
      }
    </>
    
  )
}

export default Add
