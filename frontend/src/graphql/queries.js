import gql from 'graphql-tag'

const FRIEND_FIELDS = gql`
fragment FriendFields on User {
    username
    id
}
`

export const USER_DATA = gql`
{
    getUserData {
        id
        username
        chats {
            id
            users
        }
        friends {
            ...FriendFields    
        }
        friendRequests {
            ...FriendFields
        }
        sentRequests {
            ...FriendFields
        }
    }
}
${FRIEND_FIELDS}
`

export const CHAT_MESSAGES = gql`
query chatMessages($id: ID!) {
    chatMessages(id: $id) {
        id
        user
        date
        text
    }
}
` 

export const FIND_USER = gql`
query findUser($searchterm: String!) {
    findUser(searchterm: $searchterm) {
        username
        id
    }
}
`