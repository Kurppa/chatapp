import gql  from 'graphql-tag'

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password)
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
  mutation addFriend($username: String!) {
    addFriend(
      username: $username,
    )
  }
`