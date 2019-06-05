import React from 'react'
import { Message } from 'semantic-ui-react'

export const renderMessage = (message) => {
  if (message.status === 'error') {
    return (
      <Message warning>
        <Message.Header>{message.message}</Message.Header>
      </Message>
    )
  } else if (message.status === 'success') {
    return (
      <Message success>
        <Message.Header>{message.message}</Message.Header>
      </Message>
    )
  }
}