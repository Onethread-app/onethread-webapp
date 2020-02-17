const elasticsearch = require('elasticsearch');
const logger = require('./config/winston');
// instantiate an Elasticsearch client
const client = new elasticsearch.Client({
  hosts: ['http://localhost:9200'],
});

client.ping(
  {
    requestTimeout: 30000,
  },
  function(error) {
    // at this point, eastic search is down, please check your Elasticsearch service
    if (error) {
      logger.error('Elasticsearch cluster is down!' + error);
    } else {
      logger.info('Everything is ok');
    }
  },
);

module.exports = client;
