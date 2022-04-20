import { useContext } from 'react'
import styles from './Home.module.css'
import Button from '../components/Button'
import Layout from '../components/Layout'
import AdventuresList from '../components/AdventuresList'
import { useRecentAdventures } from '../services/adventures'
import { useLogoutMutation } from '../services/user'
import { RouterContext } from '../components/RouterProvider'

const Home = () => {
  const history = useContext(RouterContext)
  const { execute } = useLogoutMutation()

  const { isLoading, data } = useRecentAdventures({ autoRun: true })

  return (
    <Layout performLogout={execute}>
      <Layout.Container>
        <div className={styles.searchContainer}>
          <input type="search" />

          <Button text="Crear aventura" />
        </div>
      </Layout.Container>

      <hr className={styles.separator} />

      <Layout.Container>
        {isLoading ? (
          'Loading adventures...'
        ) : (
          <AdventuresList
            adventures={data}
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
