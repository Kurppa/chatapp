import React from 'react'
import Conversation from './Conversation'
import FriendBar from './FriendBar'
import { Grid, Segment } from 'semantic-ui-react'

const ChatView = ({ data }) => {

  return (
   <>
   <Grid.Column width={4}>
     <Segment>
       <FriendBar friends={data.getUserData.friends.map(f => ( { username: f.username, id: f.id } ))} />
     </Segment>
   </Grid.Column>
  <Grid.Column width={12}>
    <Segment>
      <Conversation conversation={data.chats}/>
    </Segment>
  </Grid.Column>
  </>
  )
}

export default ChatView