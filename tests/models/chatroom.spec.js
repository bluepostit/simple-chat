const Db = require('../core').db
const DB_NAME = process.env.DB_NAME

describe('Chatroom', () => {
  let dbHandler
  let Chatroom

  beforeEach(async () => {
    dbHandler = await new Db().setup()
    Chatroom = await dbHandler.getDb(DB_NAME).collection('chatrooms')
  })

  afterEach(async () => {
    await Chatroom.deleteMany({})
    await dbHandler.tearDown()
  })

  describe('creating a Chatroom', () => {
    test('creates a chatroom', async () => {
      try {
        const firstCount = await Chatroom.find().count()

        await Chatroom.insertOne({ name: 'general' })
        const newCount = await Chatroom.find().count()
        expect(newCount).toBe(firstCount + 1)
      } catch (err) {
        console.error(err)
      }
    })

    test('throws error if no name is given', async () => {
      const createBadChatroom = async () => {
        await Chatroom.insertOne({ })
      }
      await expect(createBadChatroom).rejects.toThrow(/validation/)
    })

    test('throws error if name is too short', async () => {
      const createBadChatroom = async () => {
        await Chatroom.insertOne({ name: 'a' })
      }
      await expect(createBadChatroom).rejects.toThrow(/validation/)
    })

    test('throws error if a chatroom with this name exists', async () => {
      await Chatroom.insertOne({ name: 'general' })
      const createBadChatroom = async () => {
        await Chatroom.insertOne({ name: 'general' })
      }
      expect(createBadChatroom).rejects.toThrow(/name/)
    })
  })
})
