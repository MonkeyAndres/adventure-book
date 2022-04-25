import React, { useContext, useMemo, useState } from 'react'
import { match } from 'path-to-regexp'
import { useLogoutMutation, useUserProfile } from '../services/user'
import RouterProvider, { RouterContext } from '../components/RouterProvider'

import Login from './Login'
import Register from './Register'
import Home from './Home'
import Layout from '../components/Layout'
import AdventureForm from './AdventureForm'

const PublicRoutes = () => {
  const [isRegister, setIsRegister] = useState(false)

  return isRegister ? (
    <Register goToLogin={() => setIsRegister(false)} />
  ) : (
    <Login goToRegister={() => setIsRegister(true)} />
  )
}

const Switch = ({ children }) => {
  const child = useMemo(() => {
    for (const child of React.Children.toArray(children)) {
      const {
        props: { path, element, ...options },
      } = child

      if (!path) {
        return child
      }

      const matchUrl = match(path, options)(window.location.pathname)

      if (!matchUrl) {
        continue
      }

      return React.cloneElement(element, {
        params: matchUrl.params,
      })
    }
  }, [children])

  return child
}

const Route = ({ element }) => element

const PrivateRoutes = () => {
  const { execute } = useLogoutMutation()

  const history = useContext(RouterContext)
  const goToAdventures = () => history.push('/')

  return (
    <Layout goToAdventures={goToAdventures} performLogout={execute}>
      <Switch>
        <Route path="/" exact element={<Home />} />

        <Route path="/adventure/create" element={<AdventureForm />} />
        <Route path="/adventure/:id" element={<AdventureForm isEdit />} />

        <Route element={<Layout.Container>Page not found</Layout.Container>} />
      </Switch>
    </Layout>
  )
}

const RootPage = () => {
  const { isLoading, isLoggedIn } = useUserProfile({ autoRun: true })

  if (isLoading) {
    return <p>Loading...</p>
  }

  return isLoggedIn ? (
    <RouterProvider>
      <PrivateRoutes />
    </RouterProvider>
  ) : (
    <PublicRoutes />
  )
}

export default RootPage
