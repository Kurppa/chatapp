import gql from 'graphql-tag'

export const MESSAGE_SUBSCRIPTION = gql`
  subscription newMessage($chatId: ID!) {
    newMessage(chatId: $chatId) {
      id
      user
      chat
      date
      text
    }
  }
`