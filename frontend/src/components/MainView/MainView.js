import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { USER_DATA } from '../../graphql/queries'
import Chat from './chat/ChatView'
import Add from './add/Add'
import Friends from './friends/FriendsView'

import { Container, Menu } from 'semantic-ui-react'

const Content = ({ menu, data }) => {
  if (menu === 'chat') {
    return (
      <Chat data={data.getUserData} />
    )
  } else if (menu === 'friends') {
    return (
      <Friends data={data.getUserData} />
    )
  } else if (menu === 'add') {
    return (
      <Add />
    )
  } 
}

const MainView = () => {
  const [menu, setMenu] = useState('chat')

  const { data, loading } = useQuery(USER_DATA)

  if (loading ) {
    return <div>loading...</div>
  }

  return (
    <Container>
      <Menu widths={3}>
        <Menu.Item 
          name='chat'
          active={menu === 'chat'} 
          onClick={() => setMenu('chat')}
        />
        <Menu.Item
          name='friends'
          active={menu === 'friends'}
          onClick={() => setMenu('friends')}
        />
        <Menu.Item
          name='add'
          active={menu === 'add'}
          onClick={() => setMenu('add')}
        />
      </Menu>
      <Content menu={menu} data={data} />
    </Container>
  )
}

export default MainView
