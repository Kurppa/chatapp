import React from 'react'
import { Card } from 'semantic-ui-react'

const FriendBar = ({ data, setChat, chat }) => {
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

  const renderCards = (friend) => {
    if (chat === friend.chatId) {
      return (      
        <Card color='green' onClick={() => setChat(friend.chatId)} key={friend.id}>
          <Card.Content>
            <Card.Header>
              { friend.username }
            </Card.Header>
          </Card.Content>
        </Card>
      ) 
    } else {
      return (      
        <Card onClick={() => setChat(friend.chatId)} key={friend.id}>
          <Card.Content>
            <Card.Header>
              { friend.username }
            </Card.Header>
          </Card.Content>
        </Card>
      )
    }
  }

  return (
    <div>
      <Card.Group>
        {
          
          friends.map(f => {
            return renderCards(f)
          })
        }
      </Card.Group> 
    </div>
  )
}

export default FriendBar