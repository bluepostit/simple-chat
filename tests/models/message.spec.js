const { ObjectId } = require('mongodb')
const Db = require('../core').db
const DB_NAME = process.env.DB_NAME

describe('Message', () => {
  let dbHandler
  let Message
  let User
  let Chatroom

  beforeEach(async () => {
    dbHandler = await new Db().setup()
    Chatroom = await dbHandler.getDb(DB_NAME).collection('chatrooms')
    Message = await dbHandler.getDb(DB_NAME).collection('messages')
    User = await dbHandler.getDb(DB_NAME).collection('users')
  })

  afterEach(async () => {
    await Message.deleteMany({})
    await Chatroom.deleteMany({})
    await User.deleteMany({})
    await dbHandler.tearDown()
  })

  describe('creating a Message', () => {
    test('creates a message', async () => {
      try {
        const firstCount = await Message.find().count()

        const user = await User.insertOne({
          email: 'test@example.com',
          password: '123456'
        })

        const chatroom = await Chatroom.insertOne({
          name: 'general chat'
        })

        const input = {
          content: 'hello there',
          user: ObjectId(user.insertedId),
          chatroom: ObjectId(chatroom.insertedId),
          date: new Date()
        }

        const res = await Message.insertOne(input)
        const newCount = await Message.find().count()
        expect(newCount).toBe(firstCount + 1)

        const message = res.ops[0]
        expect(message.content).toBe(input.content)
        expect(message.user).toEqual(input.user)
        expect(message.chatroom).toEqual(input.chatroom)
        expect(message.date).toBe(input.date)
      } catch (err) {
        console.error(err)
      }
    })

    test('throws error if no content is given', async () => {
      const createBadMessage = async () => {
        await Message.insertOne({ })
      }
      await expect(createBadMessage).rejects.toThrow(/validation/)
    })

    test('throws error if content is too short', async () => {
      const createBadMessage = async () => {
        await Message.insertOne({ name: '' })
      }
      await expect(createBadMessage).rejects.toThrow(/validation/)
    })
  })
})
