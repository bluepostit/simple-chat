const App = require('../app')
const DB_NAME = process.env.DB_NAME

describe('User', () => {
  let app
  let db

  beforeEach(async () => {
    app = await new App().setup()
    await app.fastify.ready()
    db = await app.fastify.mongo.client.db(DB_NAME)
  })

  afterEach(async () => {
    await db.collection('users').deleteMany({})
    await app.tearDown()
  })

  describe('creating a User', () => {
    test('creates a user with a password', async () => {
      try {
        const users = await db.collection('users')

        const firstCount = await users.find().count()

        const user = await users.insertOne({ email: 'test@example.com', password: '123456' })
        const newCount = await users.find().count()
        expect(newCount).toBe(firstCount + 1)

      } catch (err) {
        console.error(err)
      }
    })
  })
})
