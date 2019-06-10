import React, { useState } from 'react'

import { FIND_USER } from '../../../graphql/queries'

import { Segment, Grid, Input } from 'semantic-ui-react'
import { useQuery } from '@apollo/react-hooks'

const SearchBar = ({ setResult }) => {
  const [value, setValue] = useState(null)

  const { data, loading } = useQuery(FIND_USER, { variables: { searchterm: value } })  

  if (loading) {
    return <div>loading...</div>
  } else {
    setResult(data)
  }

  const handleSearchChange = async (e, { value }) => {
    e.preventDefault()
    setValue(value)
  }

  return (
    <Segment style={ { width: '100%' } }>
      <Grid columns={3}>
        <Grid.Row>
          <Grid.Column>
           
          </Grid.Column>
          <Grid.Column>
            <Input value={value} onChange={handleSearchChange} />
          </Grid.Column>  
        </Grid.Row>
      </Grid>
    </Segment>
    
  )
}

export default SearchBar