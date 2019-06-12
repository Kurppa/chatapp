import React, { useState } from 'react'
import Conversation from './Conversation'
import FriendBar from './FriendBar'
import { Grid, Segment } from 'semantic-ui-react'

const ChatView = ({ data }) => {
  const [ chat, setChat ] = useState(null)

  return (
   <>
   <Grid.Column width={4}>
     <Segment>
       <FriendBar data={data} setChat={setChat} />
     </Segment>
   </Grid.Column>
  <Grid.Column width={12}>
    { chat &&
      <Segment>
        <Conversation chat={chat}/>
      </Segment>
    }
  </Grid.Column>
  </>
  )
}

export default ChatView