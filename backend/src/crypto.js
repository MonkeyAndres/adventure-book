const crypto = require('crypto')

const ALGORITHM = 'sha512'
const HASH_ITERATIONS = 1000
const HASH_LENGTH = 62

const SALT = process.env.SALT

const hashPassword = (password) => {
  if (!password) {
    return { hashedPassword: null }
  }

  const hashedPassword = crypto
    .pbkdf2Sync(password, SALT, HASH_ITERATIONS, HASH_LENGTH, ALGORITHM)
    .toString(`hex`)

  return hashedPassword
}

const validatePassword = (introducedPassword, userHash) => {
  const passwordHashed = crypto
    .pbkdf2Sync(
      introducedPassword,
      SALT,
      HASH_ITERATIONS,
      HASH_LENGTH,
      ALGORITHM,
    )
    .toString(`hex`)

  return userHash === passwordHashed
}

module.exports = { hashPassword, validatePassword }
