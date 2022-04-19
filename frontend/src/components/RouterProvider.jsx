import React, { useEffect, useMemo, useState } from 'react'
import { createBrowserHistory } from 'history'

export const RouterContext = React.createContext()

const RouterProvider = ({ children }) => {
  const [location, setLocation] = useState(window.location.pathname)
  const history = useMemo(() => createBrowserHistory(), [])

  useEffect(() => {
    const unListener = history.listen(({ location }) => {
      setLocation(location.pathname)
    })

    return unListener
  }, [history])

  return (
    // HACK! Use key to force a rerender in routes
    <RouterContext.Provider key={location} value={history}>
      {children}
    </RouterContext.Provider>
  )
}

export default RouterProvider
