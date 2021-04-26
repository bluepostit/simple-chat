const App = require('../core').app

describe('authentication', () => {
  let server
  let app
  let User

  const REGISTRATION_PATH = '/auth/register'
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

  describe('registration', () => {
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
  })
})
