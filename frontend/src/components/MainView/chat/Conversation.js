import React, { useState, useEffect } from 'react'
import { Subscription } from 'react-apollo'
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'
import { CHAT_MESSAGES } from '../../../graphql/queries'
import { SEND_MESSAGE } from '../../../graphql/mutations' 
import { MESSAGE_SUBSCRIPTION } from '../../../graphql/subscriptions'
import { cloneDeep } from 'lodash'
import { Input, Form, Button, Segment } from 'semantic-ui-react'

const parentStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  position: 'absolute',
  width: '100%',
  height: '100%',
}

/*
const boxStyle = {
  display: 'flex',
  flexGrow: 1,
  minHeight: 0,
}*/

const scrollableStyle = {
  flexGrow: 1,
  overflow: 'auto',
  minHeight: 0,
  margin: '2em'
}

const Conversation = ( { chat, me } ) => {
  const [ message, setMessage ] = useState('')

  const client = useApolloClient()

  useEffect(() => {
    const div = document.getElementById('scroller')
    if (div) {
      console.log('called')
      div.scrollTop = div.scrollHeight
    }
  }, [])

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

  const renderMessage = (m) => {
    if (me.id === m.user) {
      return (
        <Segment padded key={m.id}>
          <div style={{ float: 'right' }}>
            { m.text }
          </div>
        </Segment>
      )
    } else {
      return (
        <Segment padded key={m.id} >
          <div style={ { float: 'left ' } }>
            {m.text}  
          </div>
        </Segment>
      )
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
          const newStore = cloneDeep(dataInStore)
          newStore.chatMessages.push(newMessage)
          client.writeQuery({
            query: CHAT_MESSAGES,
            data: newStore,
            variables: {
              id: chat,
            }
          })
          const div = document.getElementById('scroller')
          div.scrollTop = div.scrollHeight
        }
      }}
    >
      {() => null}
    </Subscription>
      <div style={ parentStyle }>
        <div id='scroller' style={scrollableStyle}>
          {
            data && data.chatMessages.map(m => renderMessage(m))
          }
        </div>

        <Form style={ { padding: '1em' } } onSubmit={handleSendMessage}>
          <Input style={ { width: '40%' } } value={message} onChange={({ target }) => setMessage(target.value)} />
          <Button color='blue' style={ { float: 'right' } } type='submit'>send</Button>

        </Form>
      </div>
      
  </>
      
  )
}

export default Conversation