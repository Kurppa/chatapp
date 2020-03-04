import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { CHAT_MESSAGES } from '../../../graphql/queries'
import { SEND_MESSAGE } from '../../../graphql/mutations' 
import { Input, Button, Card } from 'semantic-ui-react'

const parentStyle = {
  display: 'flex',
  position: 'absolute',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  height: '100%',
  width: '100%',
  padding: '1rem'
}

const scrollableStyle = {
  flexGrow: 1,
  overflow: 'auto',
  minHeight: 0,
  margin: '0em 1em 1em  1em',
}

const Conversation = ( { chat, me } ) => {
  const [ message, setMessage ] = useState('')

  useEffect(() => {
    const div = document.getElementById('scroller')
    if (div) {
      div.scrollTop = div.scrollHeight
    }
  })

  //third parameter for useQuery - error
  const { data, loading } = useQuery(CHAT_MESSAGES, {
    variables: { id: chat }
  })

  //second parameter for useMutation an object { error, data } 
  const [ sendMessage ] = useMutation(SEND_MESSAGE, {
    variables: { text: message, chat: chat }
  })

  if (loading) {
    return <div>loading...</div>
  }

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
        <Card style={{ float: 'right', width: '60%', border: 'solid black 1px' }} key={m.id}>
          <Card.Content>
            <div style={{ float: 'right', maxWidth: '60%', wordWrap: 'break-word' }}>
              { m.text }
            </div>
          </Card.Content>
        </Card>
      )
    } else {
      return (
        <Card style={{ width: '60%', border: 'solid black 1px'}} key={m.id} >
          <Card.Content>
            <div style={ { float: 'left ', maxWidth: '60%', wordWrap: 'break-word' } }>
              {m.text}
            </div>
          </Card.Content>
        </Card>
      )
    }
  }

  return (
    <>  
    
    <div style={ parentStyle }>
      <div id='scroller' style={scrollableStyle}>
        {
          data && data.chatMessages.map(m => renderMessage(m))
        }
      </div>
      <form style={ { padding: '1em',  width: '100%' } } onSubmit={handleSendMessage}>
        <Input style={ { width: '60%' } } value={message} onChange={({ target }) => setMessage(target.value)} />
        <Button color='blue' style={ { float: 'right' } } type='submit'>send</Button>
      </form>
    </div>
      
  </>
      
  )
}

export default Conversation
