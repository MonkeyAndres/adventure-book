import React, { useState } from 'react'

export const QueryCacheContext = React.createContext()

const QueryCacheProvider = ({ children }) => {
  const [queryCache, updateCache] = useState(new Map())

  return (
    <QueryCacheContext.Provider value={{ queryCache, updateCache }}>
      {children}
    </QueryCacheContext.Provider>
  )
}

export default QueryCacheProvider
