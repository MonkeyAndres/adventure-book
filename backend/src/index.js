require('dotenv').config()
const express = require('express')

const authRoutes = require('./authRoutes')

const PORT = process.env.PORT

const createApp = () => {
  const app = express()

  app.set('trust proxy', 1)
  app.use(express.json())

  app.use(authRoutes())

  return app
}

const main = async () => {
  const app = createApp()

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
