module.exports = {
  async up(db, client) {
    try {
      await db.dropCollection('messages')
    } catch (e) {
      console.log("Couldn't drop collection 'messages'")
    }
    await db.createCollection('messages', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['content', 'user', 'chatroom', 'date'],
          properties: {
            content: {
              bsonType: 'string',
              description: 'must be between 1 and 1000 characters long',
              minLength: 1,
              maxLength: 1000
            },
            user: {
              bsonType: 'objectId'
            },
            chatroom: {
              bsonType: 'objectId'
            },
            date: {
              bsonType: 'date'
            }
          }
        }
      }
    })
  },

  async down(db, client) {
    await db.dropCollection('messages')
  }
};
