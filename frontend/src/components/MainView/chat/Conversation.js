import React, { useState } from 'react'
import { Subscription } from 'react-apollo'
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'
import { CHAT_MESSAGES } from '../../../graphql/queries'
import { SEND_MESSAGE } from '../../../graphql/mutations' 
import { MESSAGE_SUBSCRIPTION } from '../../../graphql/subscriptions'
import { Input, Form, Button, Segment } from 'semantic-ui-react'

const Conversation = ( { chat } ) => {
  const [ message, setMessage ] = useState('')

  const client = useApolloClient()

  const { data, loading, error } = useQuery(CHAT_MESSAGES, {
    variables: { id: chat }
  })

  const [ sendMessage, { mError, mData } ] = useMutation(SEND_MESSAGE, {
    variables: { text: message, chat: chat }
  })

  if (loading) {
    return <div>loading...</div>
  }

  const includedIn = (allMessages, newMessage) => 
    allMessages.map(m => m.id).includes(newMessage.id)

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.length > 0) {
      sendMessage()
      setMessage('')
    }
  }
  
  return (
    <>  
    <Subscription
      subscription={MESSAGE_SUBSCRIPTION}
      variables={{ chatId: chat }}
      client={client}
      onSubscriptionData={({ subscriptionData }) => {
        const newMessage = subscriptionData.data.newMessage
        
        const dataInStore = client.readQuery({ 
          query: CHAT_MESSAGES,
          variables: {
            id: chat,
          } })
        
        if (!includedIn(dataInStore.chatMessages, newMessage)) {
          dataInStore.chatMessages.push(newMessage)
          client.writeQuery({
            query: CHAT_MESSAGES,
            data: dataInStore,
            variables: {
              id: chat,
            }
          })
        }
      }}
    >
      {() => null}
    </Subscription>
    
      {
        data && data.chatMessages.map(m => <Segment key={m.id}>{m.text}</Segment>)
      }
      <div>
        <Form onSubmit={handleSendMessage}>
          <Input style={ { width: 'auto' } } value={message} onChange={({ target }) => setMessage(target.value)} />
          <Button color='blue' style={ { float: 'right' } } type='submit'>send</Button>
        </Form>
      </div>  
  </>
      
  )
}

export default Conversation