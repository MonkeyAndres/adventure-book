import { useCallback, useContext, useEffect, useMemo } from 'react'
import { QueryCacheContext } from '../components/QueryCacheProvider'
import asyncStatusReducer, {
  ACTION_TYPES,
  ASYNC_STATUSES,
  INITIAL_ASYNC_STATUS_STATE,
} from './asyncStatusReducer'

const DEFAULT_CONFIG = {
  autoRun: false,
  selector: (data) => data,
}

const useQuery = (id, promiseCreator, userConfig = {}) => {
  const config = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...userConfig }),
    [userConfig],
  )

  const { queryCache, updateCache } = useContext(QueryCacheContext)

  const state = useMemo(
    () => queryCache.get(id) || INITIAL_ASYNC_STATUS_STATE,
    [id, queryCache],
  )

  const updateQueryCache = useCallback(
    (action) => {
      updateCache((cache) => {
        const prevState = cache.get(id) || INITIAL_ASYNC_STATUS_STATE

        cache.set(id, asyncStatusReducer(prevState, action))

        return new Map(cache)
      })
    },
    [id, updateCache],
  )

  const execute = useCallback(
    async (...args) => {
      try {
        updateQueryCache({ type: ACTION_TYPES.START })

        const data = await promiseCreator(...args)

        updateQueryCache({
          type: ACTION_TYPES.STORE_DATA,
          payload: config.selector(data),
        })
      } catch (error) {
        updateQueryCache({
          type: ACTION_TYPES.SET_ERROR,
          payload: error,
        })
      }
    },
    [config, promiseCreator, updateQueryCache],
  )

  const refetch = useCallback(
    async (...args) => {
      try {
        const data = await promiseCreator(...args)

        updateQueryCache({
          type: ACTION_TYPES.STORE_DATA,
          payload: config.selector(data),
        })
      } catch (error) {
        updateQueryCache({
          type: ACTION_TYPES.SET_ERROR,
          payload: error,
        })
      }
    },
    [config, promiseCreator, updateQueryCache],
  )

  useEffect(() => {
    if (config.autoRun) {
      if (state.status !== ASYNC_STATUSES.IDLE) {
        refetch()
        return
      }

      execute()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    ...state,

    isLoading:
      state.status === ASYNC_STATUSES.IDLE ||
      state.status === ASYNC_STATUSES.PENDING,
    isPending: state.status === ASYNC_STATUSES.PENDING,
    hasSucceeded: state.status === ASYNC_STATUSES.SUCCEEDED,
    hasErrored: state.status === ASYNC_STATUSES.ERRORED,

    execute,
    refetch,
  }
}

export default useQuery
