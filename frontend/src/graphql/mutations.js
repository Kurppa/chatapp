import gql  from 'graphql-tag'

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password)
}
`

export const LOGOUT = gql`
mutation  {
    logout
}
`

export const REGISTER = gql`
mutation createUser($username: String!, $password: String!) {
  createUser(
    username: $username,
    password: $password
  ) 
}
`

export const ADD_FRIEND = gql`
mutation addFriend($id: ID!) {
  addFriend(
    id: $id,
  )
}
`

export const ACCEPT_FRIEND = gql`
mutation acceptFriendRequest($id: ID!) {
  acceptFriendRequest(
    id: $id,
  )
}
`

export const START_CHAT = gql`
mutation createChat($id: ID!) {
  createChat(
    id: $id,
  )
}
` 
