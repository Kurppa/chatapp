import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { USER_DATA } from '../../graphql/queries'
import ChatView from './chat/ChatView'
import Add from './add/Add'

import { Grid, Menu } from 'semantic-ui-react'

const Content = ({ menu, data }) => {
  if (menu === 'chat') {
    return (
      <ChatView data={data}/>
    )
  } else if (menu === 'friends') {
    return (
      <div>
        Friends should show here
      </div>
    )
  } else if (menu === 'add') {
    return (
      <Add />
    )
  } else {
    return (
      <div>
        nada
      </div>
    )
  }
}

const MainView = () => {
  const [menu, setMenu] = useState('chat')

  const { data, loading } = useQuery(USER_DATA)

  if (loading ) {
    return <div>loading...</div>
  }

  console.log(data)

  //<SearchBar gqlError={gqlError} addFriend={addFriend} data={udata.getAllUsers} />
  return (
    <Grid>
      <Grid.Row>
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
      </Grid.Row>
      
      <Content menu={menu} data={data} />
      
    </Grid>
  )
}

export default MainView
