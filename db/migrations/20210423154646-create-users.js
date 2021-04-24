module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              bsonType: 'string',
              description: 'must be a valid email address',
              // pattern: '[\w+.]{2,}@(\w+\.\w+)+$'
              pattern: '.*'
            },
            password: {
              bsonType: 'string',
              minLength: 6,
              maxLength: 24
            }
          }
        }
      }
    })
    await db.collection('users').createIndex('email', { unique: true })
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    await db.dropCollection('users')
  }
};
