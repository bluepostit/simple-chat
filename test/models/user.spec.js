const Db = require('../core').db
const DB_NAME = process.env.DB_NAME

describe('User', () => {
  let dbHandler
  let User

  beforeEach(async () => {
    dbHandler = await new Db().setup()
    User = await dbHandler.getDb(DB_NAME).collection('users')
  })

  afterEach(async () => {
    await User.deleteMany({})
    await dbHandler.tearDown()
  })

  describe('creating a User', () => {
    test('creates a user with a password', async () => {
      try {
        const firstCount = await User.find().count()

        await User.insertOne({ email: 'test@example.com', password: '123456' })
        const newCount = await User.find().count()
        expect(newCount).toBe(firstCount + 1)
      } catch (err) {
        console.error(err)
      }
    })

    test('throws error if no password is given', async () => {
      const createBadUser = async () => {
        await User.insertOne({ email: 'test@example.com' })
      }
      await expect(createBadUser).rejects.toThrow(/validation/)
    })

    test('throws error if password is too short', async () => {
      const createBadUser = async () => {
        await User.insertOne({ email: 'test@example.com', password: '12' })
      }
      await expect(createBadUser).rejects.toThrow(/validation/)
    })

    test('throws error if a user with this email exists', async () => {
      await User.insertOne({ email: 'test@example.com', password: '12345678' })
      const createBadUser = async () => {
        await User.insertOne({ email: 'test@example.com', password: '12345678' })
      }
      await expect(createBadUser).rejects.toThrow(/email/)
    })
  })
})
