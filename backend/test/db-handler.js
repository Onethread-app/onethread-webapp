const mongoose = require('mongoose');
const redis = require('redis');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();
let red = redis.RedisClient;
/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
  const uri = await mongod.getConnectionString();

  const mongooseOpts = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  };

  mongoose.connect(uri, mongooseOpts);
  red = redis.createClient();
};

/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
  await new Promise((resolve) => {
    red.quit(() => {
      resolve();
    });
  });
  // redis.quit() creates a thread to close the connection.
  // We wait until all threads have been run once to ensure the connection closes.
  await new Promise((resolve) => setImmediate(resolve));
};

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
