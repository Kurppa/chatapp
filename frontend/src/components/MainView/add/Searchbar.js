import React, { useState } from 'react'

import { ALL_USERNAMES } from '../../../graphql/queries'

import { Search, Segment, Grid } from 'semantic-ui-react'
import { useQuery } from '@apollo/react-hooks'

const SearchBar = ({ addFriend, gqlError }) => {
  const [search, setSearch] = useState(
    { 
      isLoading: false,
      results: [],
      value: '' 
    }
  )

  const { data, loading } = useQuery(ALL_USERNAMES) 

  if (loading) {
    return <div>loading...</div>
  }

  const handleResultSelect = async (e, { result }) =>  {
    setSearch( search => ({ ...search, value: result.title }))
    try {
      await addFriend({
        variables: { username: result.title }
      })
    } catch (e) {
      gqlError(e)
    }
  }

  const handleSearchChange = async (e, { value }) => {
    e.preventDefault()
    setSearch( search => ({ ...search, value, results: data.getAllUsers.filter(d => d.startsWith(value)).map(d => ( { title: d } ))  }) )
  }

  return (
    <Segment style={ { width: '100%' } }>
      <Grid columns={3}>
        <Grid.Row>
          <Grid.Column>
           
          </Grid.Column>
          <Grid.Column>
            <Search
              loading={search.isLoading}
              onResultSelect={handleResultSelect}
              onSearchChange={handleSearchChange}
              results={search.results}
              value={search.value}
            />
          </Grid.Column>  
        </Grid.Row>
      </Grid>
    </Segment>
    
  )
}

export default SearchBar