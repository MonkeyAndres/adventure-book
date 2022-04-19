export const EMAIL_VALIDATION_REGEXP =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const isValidEmail = (value) => EMAIL_VALIDATION_REGEXP.test(value)

export const isNil = (value) => value === null || value === undefined

export const length = (value) =>
  value === 'number' ? String(value).length : Object.values(value).length

export const isEmpty = (value) => length(value) === 0

export const isNilOrEmpty = (value) => isNil(value) || isEmpty(value)

export const not = (fn) => (value) => !fn(value)

export const isRequired = not(isNilOrEmpty)
