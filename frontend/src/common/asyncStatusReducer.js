export const ASYNC_STATUSES = {
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  SUCCEEDED: 'SUCCEEDED',
  ERRORED: 'ERRORED',
}

export const ACTION_TYPES = {
  START: 'START',
  STORE_DATA: 'STORE_DATA',
  SET_ERROR: 'SET_ERROR',
  RESET: 'RESET',
}

export const INITIAL_ASYNC_STATUS_STATE = {
  status: ASYNC_STATUSES.IDLE,
  data: null,
  error: null,
}

const asyncStatusReducer = (state = INITIAL_ASYNC_STATUS_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPES.START: {
      return {
        ...state,
        status: ASYNC_STATUSES.PENDING,
      }
    }

    case ACTION_TYPES.STORE_DATA: {
      return {
        status: ASYNC_STATUSES.SUCCEEDED,
        data: action.payload,
        error: null,
      }
    }

    case ACTION_TYPES.SET_ERROR: {
      return {
        status: ASYNC_STATUSES.ERRORED,
        data: null,
        error: action.payload,
      }
    }

    case ACTION_TYPES.RESET: {
      return INITIAL_ASYNC_STATUS_STATE
    }

    default: {
      return state
    }
  }
}

export default asyncStatusReducer
