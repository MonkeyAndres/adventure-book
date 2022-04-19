export class NetworkError extends Error {
  constructor(error) {
    super(error.message)

    this.name = this.constructor.name
    this.wrappedError = error
  }
}

export class StatusError extends Error {
  constructor(status, statusText, data) {
    super(`${status} (${statusText})`)

    this.name = this.constructor.name
    this.status = status
    this.statusText = statusText

    this.data = data
  }
}

export class JSONError extends Error {
  constructor(error) {
    super(error.message)

    this.name = this.constructor.name
    this.wrappedError = error
  }
}

const enhancedFetch = async (
  method,
  url,
  { parseJSON, data, ...options } = {},
) => {
  // Prepare request headers
  const headers = options.headers ?? {}

  if (parseJSON) {
    headers['Accept'] = 'application/json'
  }

  let body
  if (data) {
    body = JSON.stringify(data)
    headers['Content-Type'] = 'application/json'
  }

  // Try fetching
  let res
  try {
    res = await fetch(url, {
      method,
      credentials: 'include',
      ...options,
      headers,
      body,
    })
  } catch (e) {
    throw new NetworkError(e)
  }

  // Status error case!
  if (!res.ok) {
    // Try parsing error JSON (ignore if cannot parse)
    let errData
    try {
      errData = await res.json()
    } catch (e) {
      // Swallow
    }

    throw new StatusError(res.status, res.statusText, errData)
  }

  // Parse JSON if needed (error if cannot parse)
  let resData
  if (parseJSON) {
    try {
      resData = await res.json()
    } catch (e) {
      throw new JSONError(e)
    }
  }

  // Success!
  return {
    res,
    data: resData,
  }
}

export default enhancedFetch
