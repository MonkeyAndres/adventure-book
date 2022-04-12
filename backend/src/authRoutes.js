const { Router } = require('express')
const { PrismaClient } = require('@prisma/client')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const { validatePassword, hashPassword } = require('./crypto')

const session = require('express-session')

const requireAuthentication = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Login required.' })
  }

  next()
}

const successResponseController = (req, res) => res.status(200).end()

const authRoutes = () => {
  const router = Router()
  const prisma = new PrismaClient()

  router.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  )

  router.use(passport.initialize())
  router.use(passport.session())

  passport.serializeUser((userId, done) => done(null, userId))
  passport.deserializeUser(async (userId, done) => {
    try {
      const userData = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!userData || !userData.id) {
        done(null, null)
      } else {
        done(null, userData)
      }
    } catch (error) {
      done(error)
    }
  })

  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          })

          if (!user) {
            return done(null, false)
          }

          if (!validatePassword(password, user.password)) {
            return done(null, false)
          }

          return done(null, user.id)
        } catch (error) {
          return done(error)
        }
      },
    ),
  )

  router.post('/auth/register', async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: `Missing fields` })
    }

    const existingUserWithEmail = await prisma.user.count({ where: { email } })

    if (existingUserWithEmail) {
      return res
        .status(400)
        .json({ error: `User with email "${email}" already exists` })
    }

    const newUser = await prisma.user.create({
      data: { name, email, password: hashPassword(password) },
    })

    req.login(newUser.id, (error) => {
      if (error) {
        return res.status(500).end()
      }

      res.status(200).end()
    })
  })

  router.post(
    '/auth/login',
    passport.authenticate('local', { session: true }),
    successResponseController,
  )

  router.use(requireAuthentication)

  router.get('/auth/login', successResponseController)

  router.post('/auth/logout', (req, res) => {
    req.logout()
    res.status(200).end()
  })

  return router
}

module.exports = authRoutes
