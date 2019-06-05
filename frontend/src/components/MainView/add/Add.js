import React from 'react'

import { useMutation } from '@apollo/react-hooks'
import { ADD_FRIEND } from '../../../graphql/mutations'
import { USER_DATA } from '../../../graphql/queries'

import SearchBar from './Searchbar'

const Add = () => {

  const addFriend = useMutation(ADD_FRIEND, {
    refetchQueries: [{ query: USER_DATA }]
  })

  return (
    <SearchBar gqlError={() => {}} addFriend={addFriend}/>
  )
}

export default Add