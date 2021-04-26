require('../config/environment').load()
const process = require('process')

const fastify = require('fastify')
const mongo = require('mongodb')
const fastifyMongoDb = require('fastify-mongodb')
const MONGODB_URL = process.env.MONGODB_URL

const buildMongoClient = async () => {
  const client = await mongo.MongoClient.connect(
    MONGODB_URL,
    {
      useUnifiedTopology: true
    })
  return client
}

class App {
  async tearDown() {
    await this.app.close()
    await this.mongoClient.close()
  }

  async setup() {
    this.mongoClient = await buildMongoClient()
    this.app = fastify()
    this.app.register(fastifyMongoDb, { client: this.mongoClient })
    this.app.register(require('../app/routes/auth.routes'))
    return this
  }

  get fastify() {
    return this.app
  }
}

class Db {
  async tearDown() {
    await this.mongoClient.close()
  }

  async setup() {
    this.mongoClient = await buildMongoClient()
    return this
  }

  getDb(name) {
    return this.mongoClient.db(name)
  }
}

module.exports = {
  app: App,
  db: Db
}
