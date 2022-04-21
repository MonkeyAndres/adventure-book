import { useCallback, useContext, useMemo, useState } from 'react'
import styles from './Home.module.css'
import Button from '../components/Button'
import Layout from '../components/Layout'
import AdventuresList from '../components/AdventuresList'
import {
  useAdventuresSearch,
  useRecentAdventures,
} from '../services/adventures'
import { useLogoutMutation } from '../services/user'
import { RouterContext } from '../components/RouterProvider'
import { isNil } from '../common/validation'

const debounce = (fn, ms) => {
  let timeout = null

  return (...args) => {
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      timeout = null

      fn(...args)
    }, ms)
  }
}

const Home = () => {
  const history = useContext(RouterContext)
  const { execute } = useLogoutMutation()

  const { isLoading, data } = useRecentAdventures({ autoRun: true })

  const {
    isPending: isSearching,
    data: searchResults,
    search,
  } = useAdventuresSearch()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useMemo(() => debounce(search, 300), [])

  const [searchQuery, updateSearchQuery] = useState('')

  const handleSearchQueryChange = useCallback(
    (ev) => {
      const newValue = ev.target.value

      updateSearchQuery(newValue)
      debouncedSearch(newValue)
    },
    [debouncedSearch],
  )

  return (
    <Layout performLogout={execute}>
      <Layout.Container>
        <div className={styles.searchContainer}>
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />

          <Button text="Crear aventura" />
        </div>
      </Layout.Container>

      <hr className={styles.separator} />

      <Layout.Container>
        {isLoading || isSearching || isNil(data) ? (
          'Loading adventures...'
        ) : (
          <AdventuresList
            adventures={searchQuery ? searchResults : data}
            goToAdventureDetail={(adventureId) =>
              history.push(`/adventure/${adventureId}`)
            }
          />
        )}
      </Layout.Container>
    </Layout>
  )
}

export default Home
