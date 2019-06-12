import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ACCEPT_FRIEND, START_CHAT, REMOVE_FRIEND } from '../../../graphql/mutations'
import { USER_DATA } from '../../../graphql/queries'
import { Header, Segment, Icon } from 'semantic-ui-react'

const Friends = ( { users, startConversation, removeFriend } ) => {
  return (
    <>
    <Header as='h2'>Friends</Header>
    {
      users.map(u => (
        <Segment inverted color='green' style={{ width: '100%' }} key={u.id}>
          <Header style={{ display: 'inline' }} as='h2'>{u.username}</Header>
          <Icon onClick={() => removeFriend({ variables: { id: u.id } })} size='big' style={ { float: 'right' } } name='cancel' color='red'/>
          <Icon onClick={() => startConversation({ variables: { id: u.id } })} size='big' style={ { float: 'right' } } name='chat' />
        </Segment>
      ))  
    }
    </>
  )
}

const SentRequests = ( { users } ) => {
  return (
    <>
    <Header as='h2'>Sent requests</Header>
    {
      users.map(u => (
        <Segment color='blue' style={{ width: '100%' }} key={u.id}>
          <Header style={{ display: 'inline' }} as='h2'>{u.username}</Header> 
          <Icon size='big' style={ { float: 'right' } } name='cancel' color='red'/>
          <Icon size='big' style={ { float: 'right' } } name='checkmark' color='green' />
        </Segment>
      ))  
    }
    </>
  )
}

const ReceivedRequests = ( { users, acceptFriend } ) => {
  return (
    <>
    <Header as='h2'>Friend requests</Header>
    {
      users.map(u => (
        <Segment color='teal' style={{ width: '100%' }} key={u.id}>
          <Header style={{ display: 'inline' }} as='h2'>{u.username}</Header>
          <Icon size='big' style={ { float: 'right' } } name='cancel' color='red' />
          <Icon onClick={() => acceptFriend({ variables: { id: u.id } })} size='big' style={ { float: 'right' } } name='checkmark' color='green'/>
        </Segment>
      ))  
    }
    </>
  )
}

const FriendView = ( { data } ) => {
  const [ acceptFriend ] = useMutation(ACCEPT_FRIEND, {
    refetchQueries: [{ query: USER_DATA }]
  })

  const [ removeFriend ] = useMutation(REMOVE_FRIEND, {
    refetchQueries: [{ query: USER_DATA }]
  })

  const [ startConversation ] = useMutation(START_CHAT, {
    refetchQueries: [{ query: USER_DATA }]
  })

  return(
    <Segment style={{ width: '100%' }}>
      {
        data.friends.length > 0 ? 
          <Friends users={data.friends} startConversation={startConversation} removeFriend={removeFriend} />
          : null
      }
      {
        data.sentRequests.length > 0 ? 
          <SentRequests users={data.sentRequests} />
          : null
      }
      {
        data.friendRequests.length > 0 ? 
          <ReceivedRequests users={data.friendRequests} acceptFriend={acceptFriend} />
          : null
      }
    </Segment>
  )
}

export default FriendView