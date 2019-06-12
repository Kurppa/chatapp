import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { CHAT_MESSAGES } from '../../../graphql/queries'
import { SEND_MESSAGE } from '../../../graphql/mutations' 
import { Input, Form, Button, Segment } from 'semantic-ui-react'

const Conversation = ( { chat } ) => {
  const [ message, setMessage ] = useState('')

  const { data, loading, error } = useQuery(CHAT_MESSAGES, {
    variables: { id: chat }
  })

  const [ sendMessage, { mError, mData } ] = useMutation(SEND_MESSAGE, {
    variables: { text: message, chat: chat }
  })

  if (loading) {
    return <div>loading...</div>
  }

  console.log(data)

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.length > 0) {
      sendMessage()
      setMessage('')
    }
  }

  return (
    <div>
      {
        data && data.chatMessages.map(m => <Segment key={m.id}>{m.text}</Segment>)
      }
      <div>
        <Form onSubmit={handleSendMessage}>
          <Input style={ { width: 'auto' } } value={message} onChange={({ target }) => setMessage(target.value)} />
          <Button color='blue' style={ { float: 'right' } } type='submit'>send</Button>
        </Form>
      </div>
    </div>
  )
}

export default Conversation