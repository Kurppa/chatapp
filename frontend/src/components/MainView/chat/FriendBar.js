import React from 'react'
import { Card } from 'semantic-ui-react'

const FriendBar = ({ data, setChat }) => {
  if (data.chats.length < 1) {
    return (
      <div>
        
      </div>
    )
  }
  
  const friends = data.chats.map(chat => {
    const friendId = chat.users.find(u => u !== data.id) 
    return { ...(data.friends.find(friend => friend.id === friendId )), chatId: chat.id }   
  })

  return (
    <div>
      <Card.Group>
        {
          
          friends.map(f => <Card onClick={() => setChat(f.chatId)} key={f.id}>
            <Card.Content>
              <Card.Header>
                { f.username }
              </Card.Header>
            </Card.Content>
          </Card>)
        }
      </Card.Group> 
    </div>
  )
}

export default FriendBar