import React from 'react'
import { Card } from 'semantic-ui-react'

const FriendBar = ({ friends }) => {
  if (friends.length < 1) {
    return (
      <div>
        
      </div>
    )
  }
  
  return (
    <div>
      <Card.Group items={friends.map(f => ({ header: f.username }))} />
    </div>
  )
}

export default FriendBar