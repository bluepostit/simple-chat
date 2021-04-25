module.exports = {
  async up(db, client) {
    await db.createCollection('chatrooms', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'must be a valid name',
              minLength: 3,
              maxLength: 24
            }
          }
        }
      }
    })
    await db.collection('chatrooms').createIndex('name', { unique: true })
  },

  async down(db, client) {
    await db.dropCollection('chatrooms')
  }
};
