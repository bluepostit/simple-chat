const App = require('../core').app

const AUTH_PATH = '/auth'
const REGISTRATION_SUFFIX = '/register'
const REGISTRATION_PATH = AUTH_PATH + REGISTRATION_SUFFIX
const LOGIN_SUFFIX = '/login'
const LOGIN_PATH = AUTH_PATH + LOGIN_SUFFIX

describe(AUTH_PATH, () => {
  let server
  let app
  let User

  const TEST_EMAIL = 'test@example.com'
  const TEST_PASSWORD = '123456'

  beforeEach(async () => {
    server = new App()
    await server.setup()
    app = server.fastify
    User = await server.db.collection('users')
  })

  afterEach(async () => {
    await server.clearData()
    await server.tearDown()
  })

  describe(REGISTRATION_SUFFIX, () => {
    test('creates a new user', async () => {
      const res = await app.inject({
        method: 'POST',
        url: REGISTRATION_PATH,
        payload: {
          email: TEST_EMAIL,
          password: TEST_PASSWORD
        }
      })
      expect(res.statusCode).toBe(200)
      expect(res.body).toMatch(/success/i)

      // Check that the user was created
      const user = await User.findOne({ email: TEST_EMAIL })
      expect(user).not.toBeNull()
    })

    test('hashes user email', async () => {
      await app.inject({
        method: 'POST',
        url: REGISTRATION_PATH,
        payload: {
          email: TEST_EMAIL,
          password: TEST_PASSWORD
        }
      })
      const user = await User.findOne({ email: TEST_EMAIL })
      expect(user.password).not.toBe(TEST_PASSWORD)
    })

    test('throws error when no email is given', async () => {
      const res = await app.inject({
        method: 'POST',
        url: REGISTRATION_PATH,
        payload: {
          password: TEST_PASSWORD
        }
      })
      expect(res.statusCode).toBe(400)
      expect(res.body).toMatch(/email/i)
    })

    test('throws error when no password is given', async () => {
      const res = await app.inject({
        method: 'POST',
        url: REGISTRATION_PATH,
        payload: {
          email: TEST_EMAIL
        }
      })
      expect(res.statusCode).toBe(400)
      expect(res.body).toMatch(/password/i)
    })
  })

  describe(LOGIN_SUFFIX, () => {
    const register = async () => {
      const res = await app.inject({
        method: 'POST',
        url: REGISTRATION_PATH,
        payload: {
          email: TEST_EMAIL,
          password: TEST_PASSWORD
        }
      })
      expect(res.statusCode).toBe(200)
      expect(res.body).toMatch(/success/i)
    }

    test('successfully authenticates the user', async () => {
      await register()
      const res = await app.inject({
        method: 'POST',
        url: LOGIN_PATH,
        payload: {
          email: TEST_EMAIL,
          password: TEST_PASSWORD
        }
      })
      expect(res.statusCode).toBe(200)
      expect(res.body).toMatch(/success/)
    })
  })
})
