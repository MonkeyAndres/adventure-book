import React, { useMemo, useState } from 'react'
import { pathToRegexp } from 'path-to-regexp'
import { useLogoutMutation, useUserProfile } from '../services/user'

import Login from './Login'
import Register from './Register'
import Home from './Home'
import Layout from '../components/Layout'
import AdventureForm from './AdventureForm'
import RouterProvider from '../components/RouterProvider'

const PublicRoutes = () => {
  const [isRegister, setIsRegister] = useState(false)

  return isRegister ? (
    <Register goToLogin={() => setIsRegister(false)} />
  ) : (
    <Login goToRegister={() => setIsRegister(true)} />
  )
}

const Switch = ({ children }) => {
  const child = useMemo(
    () =>
      React.Children.toArray(children).find((child) => {
        const {
          props: { path, element, ...options },
        } = child

        if (!path) {
          return true
        }

        const pathRegexp = pathToRegexp(path, [], options)

        return pathRegexp.test(window.location.pathname)
      }),
    [children],
  )

  return child
}

const Route = ({ element }) => element

const PrivateRoutes = () => {
  const { execute } = useLogoutMutation()

  return (
    <RouterProvider>
      <Layout performLogout={execute}>
        <Switch>
          <Route path="/" exact element={<Home />} />

          <Route path="/adventure/create" element={<AdventureForm />} />
          <Route path="/adventure/:id" element={'Detail'} />

          <Route element={'404'} />
        </Switch>
      </Layout>
    </RouterProvider>
  )
}

const RootPage = () => {
  const { isLoading, isLoggedIn } = useUserProfile({ autoRun: true })

  if (isLoading) {
    return <p>Loading...</p>
  }

  return isLoggedIn ? <PrivateRoutes /> : <PublicRoutes />
}

export default RootPage
