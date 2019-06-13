import React, { useState } from 'react'

import { useMutation, useQuery } from '@apollo/react-hooks'
import { ADD_FRIEND } from '../../../graphql/mutations'
import { USER_DATA, FIND_USER } from '../../../graphql/queries'

import { Segment, Input, Header } from 'semantic-ui-react'

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
    addFriend({ variables: { id: data.findUser.id } })
    setValue('')
  }
    
  return (
    <>
      <Segment style={{ width: '100%' }}>
        <Header style={{ display: 'inline' }} as='h3'>Find user: </Header><Input style={{ float: 'right', display: 'inline' }} value={value} onChange={handleSearchChange} />
      {
        loading ? 
          <Segment style={{ width: '100%' }}></Segment>
          : <Segment onClick={ addFriendCaller } style={{ width: '100%' }}>
        
            {  data.findUser ? 
              <p key={data.findUser.id}>{data.findUser.username}</p> 
              : null
            }
      }
    </>
  )
}

export default Add
