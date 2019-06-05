import gql from 'graphql-tag'

export const USER_DATA = gql`
    {
        getUserData {
            username
            chats
            friends {
                username
                id
            }
        }
    }
`

export const ALL_USERNAMES = gql`
    {
      getAllUsers
    }
`