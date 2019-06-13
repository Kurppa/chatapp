import React, { useState } from 'react'
import Conversation from './Conversation'
import FriendBar from './FriendBar'
import { Grid, Segment } from 'semantic-ui-react'

const ChatView = ({ data }) => {
  const [ chat, setChat ] = useState(null)

  return (
    <Grid style={{ height: '80vh' }}>
      <Grid.Row stretched>
        <Grid.Column width={4}>
          <Segment>
            <FriendBar data={data} setChat={setChat} />
          </Segment>
        </Grid.Column>
        <Grid.Column style={{ height: '100%' }} width={12}>
          { chat &&
          <Segment >
            <Conversation me={data} chat={chat}/>
          </Segment>
          }
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default ChatView