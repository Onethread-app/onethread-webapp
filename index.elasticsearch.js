var elasticsearch = require('elasticsearch');
const logger = require('./config/winston');
const chalk = require('chalk');
require('dotenv').config();

class ElasticsearchService {
  constructor() {
    this.client = new elasticsearch.Client({
      host: process.env.ELASTIC_SEARCH_ADDRESS,
      auth: {
        username: 'elastic',
        password: 'changeme',
      },
    }); 
  }

  checkHealth(){

    this.client.ping({
      requestTimeout: 30000,
    })
      .then(res => logger.info('Elasticsearch cluster is ok '))
      .catch(error => logger.error('Elasticsearch cluster is down!' + error));

    this.client.cluster.health()
      .then(res => logger.info(chalk.keyword(res.status)(`Elasticsearch cluster health is ${res.status}`)))
      .catch(err => logger.error(err));

  }

  async create(index,model,mapping) {
    try {
      const res = await this.client.indices.exists({
        index: index,
      });

      if (!res) {

        const createdIndex = await this.client.indices.create({
          index: index,
          body: mapping
        });

        if (createdIndex.acknowledged) {

          const bulk = [];

          const dataset = await model.find({});


          dataset.forEach(data => {
            bulk.push({
              index: { _index: index }
            });
            bulk.push({
              mongo_id: data._id.toString(),
              name: data.name,
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName
            });
          });

          await this.client.bulk({ body: bulk });

          logger.info(` ✔ ️ successfully created Elasticsearch index ${createdIndex.index}`)

        }

        else {

          logger.error(` Elasticsearchindex ${index}  creation failed`)

        }

      } else {
        logger.info(` ✔ ️Elasticsearch index ${index} exits`);
      }
    } catch (error) {
      logger.error(error)
    }
  }

  search(indexName, indexType, body) {

    return this.client.search({
      index: indexName,
      type: indexType,
      body
    })

  }

  set(indexName, indexType, document) {

    return this.client.index({
      index: indexName,
      type: indexType,
      body: document,
      refresh: "true"
    })
  }




}

module.exports = ElasticsearchService;
