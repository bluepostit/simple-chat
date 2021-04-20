const App = require('../app')
const DB_NAME = process.env.DB_NAME

describe('User', () => {
  let app
  let fastify
  beforeEach(async () => {
    app = await new App().setup()
    fastify = app.fastify
    await fastify.ready()
  })

  afterAll(async () => {
    await app.tearDown()
  })

  describe('creating a User', () => {
    test('creates a user with a password', async () => {
      console.log(fastify.mongo.client)
      try {
        const db = await fastify.mongo.client.db(DB_NAME)
        const users = await db.collection('users')

        const user = await users.insertOne({ email: 'test@example.com', password: '123456' })
        console.log(user)
      } catch (err) {
        console.error(err)
      }
    })
  })
})
