import React, { useState } from 'react'
import { useApolloClient } from '@apollo/react-hooks'
import { MESSAGE_SUBSCRIPTION } from '../../../graphql/subscriptions'
import { CHAT_MESSAGES } from '../../../graphql/queries'
import { Subscription } from 'react-apollo'
import { cloneDeep } from 'lodash'

import Conversation from './Conversation'
import FriendBar from './FriendBar'
import { Grid, Segment, Message } from 'semantic-ui-react'

const ChatView = ({ data }) => {
  const [ activeChat, setActiveChat ] = useState(null)
  const [ subscriptionList, setSubscriptionList ] = useState([])

  const client = useApolloClient()

  const setChat = (chatId) => {
    setActiveChat(chatId)
    if (!subscriptionList.find(id => id === chatId)) {
      setSubscriptionList(subscriptionList.concat(chatId))
    }
  }

  const includedIn = (allMessages, newMessage) => 
    allMessages.map(m => m.id).includes(newMessage.id)

  if (data.chats.length < 1 && data.friends.length < 1) {
    return (
      <Segment>
        <Message info>
          <Message.Header>
            Start chatting!
          </Message.Header>
          <p>
            Make your way to the add tab and add some friends!
          </p>
        </Message>
      </Segment>
    )
  } else if (data.chats.length < 1) {
    return (
      <Segment>
        <Message info>
          <Message.Header>
            Start chatting!
          </Message.Header>
          <p>
            Make your way to the friends tab and start a chat with a friend of yours!
          </p>
        </Message>
      </Segment>
    )
  }

  return (
    <>
    {
      //subscriptions for new messages are active for all opened chats
      //when chat is opened initially CHAT_MESSAGES query is run in conversation component
      subscriptionList.map(chatId => (
        <Subscription
          key={chatId}
          subscription={MESSAGE_SUBSCRIPTION}
          variables={{ chatId: chatId }}
          client={client}
          onSubscriptionData={({ subscriptionData }) => {
            const newMessage = subscriptionData.data.newMessage
        
            const dataInStore = client.readQuery({ 
              query: CHAT_MESSAGES,
              variables: {
                id: chatId,
              } })
        
            if (!includedIn(dataInStore.chatMessages, newMessage)) {
              const newStore = cloneDeep(dataInStore)
              newStore.chatMessages.push(newMessage)
              client.writeQuery({
                query: CHAT_MESSAGES,
                data: newStore,
                variables: {
                  id: chatId,
                }
              })
            }
          }}
        >
          {() => null}
        </Subscription>
      ))
    }

    <Grid style={{ height: '80vh' }}>
      <Grid.Row stretched>
        <Grid.Column style={{ height: '100%' }} width={4}>
          <Segment>
            <FriendBar chat={activeChat} data={data} setChat={setChat} />
          </Segment>
        </Grid.Column>
        <Grid.Column  width={12}>
          { activeChat &&
              <div style={{ backgroundColor: 'white', width: '100%' }}>
                <Conversation me={data} chat={activeChat}/>
              </div>
          }
        </Grid.Column>
      </Grid.Row>
    </Grid>
    </>
  )
}

export default ChatView
