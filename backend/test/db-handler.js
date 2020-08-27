const mongoose = require('mongoose');
const fs = require('fs');
const util = require('util');
const config = require('../config/config');
const redis = require('redis-mock');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Plan = require('../server/plan/plan.model');


// fs.readdir is written with callbacks. 
// This line converts fs.readdir into a promise
const readDir = util.promisify(fs.readdir);
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
  red = redis.createClient({
      port: config.redis.port,
      host: config.redis.host
  });
  red.auth(config.redis.password, (err, response) => {
    // if (err) {
    //   logger.error(`${err}`);
    // }
    // logger.info(`authentication: ${response}`);
  });
};

/**
 * Seed Database , plan schema
 */
module.exports.seedDatabase = async () =>{
  const planList = [
    {"validity":30,"version":0,"isActive":true,"name":"trial","maxTier":100,"description":"for teams and individuals","pricing":0,"__v":0},
    {"validity":30,"version":0,"isActive":true,"name":"workspaces","maxTier":100,"description":"for teams and individuals","pricing":7.99,"__v":0}
  ];
  await Plan.create(planList);
}
/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
 
};
module.exports.closeInstance = async()=>{
    await new Promise((resolve) => {
        red.quit(() => {
          resolve();
        });
      });
      // redis.quit() creates a thread to close the connection.
      // We wait until all threads have been run once to ensure the connection closes.
      await new Promise((resolve) => setImmediate(resolve));
}
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
