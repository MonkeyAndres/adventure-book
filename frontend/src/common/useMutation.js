import { useCallback, useReducer } from 'react'
import asyncStatusReducer, {
  ACTION_TYPES,
  ASYNC_STATUSES,
  INITIAL_ASYNC_STATUS_STATE,
} from './asyncStatusReducer'

const useMutation = (promiseCreator) => {
  const [state, dispatch] = useReducer(
    asyncStatusReducer,
    INITIAL_ASYNC_STATUS_STATE,
  )

  const execute = useCallback(
    async (...args) => {
      try {
        dispatch({ type: ACTION_TYPES.START })

        const data = await promiseCreator(...args)

        dispatch({
          type: ACTION_TYPES.STORE_DATA,
          payload: data,
        })
      } catch (error) {
        dispatch({
          type: ACTION_TYPES.SET_ERROR,
          payload: error,
        })
      }
    },
    [promiseCreator],
  )

  return {
    ...state,

    isLoading:
      state.status === ASYNC_STATUSES.IDLE ||
      state.status === ASYNC_STATUSES.PENDING,
    isPending: state.status === ASYNC_STATUSES.PENDING,
    hasSucceeded: state.status === ASYNC_STATUSES.SUCCEEDED,
    hasErrored: state.status === ASYNC_STATUSES.ERRORED,

    execute,
  }
}

export default useMutation
