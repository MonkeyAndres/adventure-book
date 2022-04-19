import React, { useState } from 'react'
import { useUserProfile } from '../services/user'

import Login from './Login'
import Register from './Register'

const PublicRoutes = () => {
  const [isRegister, setIsRegister] = useState(false)

  return isRegister ? (
    <Register goToLogin={() => setIsRegister(false)} />
  ) : (
    <Login goToRegister={() => setIsRegister(true)} />
  )
}

const RootPage = () => {
  const { isLoading, isLoggedIn } = useUserProfile({ autoRun: true })

  if (isLoading) {
    return <p>Loading...</p>
  }

  return isLoggedIn ? <>I'm logged in</> : <PublicRoutes />
}

export default RootPage
