import React, { useMemo, useState } from 'react'
import { pathToRegexp } from 'path-to-regexp'
import { useUserProfile } from '../services/user'

import Login from './Login'
import Register from './Register'
import Home from './Home'

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
  return (
    <Switch>
      <Route path="/" exact element={<Home />} />

      <Route path="/adventure/create" element={'Create'} />
      <Route path="/adventure/:id" element={'Detail'} />

      <Route element={'404'} />
    </Switch>
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
