var elasticsearch = require('elasticsearch');
const logger = require('./config/winston');
const chalk = require('chalk');

class ElasticsearchService {
  constructor(index, model) {
    this.index = index;
    this.model = model;
    this.client = new elasticsearch.Client({
      //host: 'https://search-testtigrow-2a67nuu3pc3clgioybdg6qlwxy.ap-southeast-1.es.amazonaws.com',
      host: 'http://localhost:9200',
      auth: {
        username: 'elastic',
        password: 'changeme',
      },
    });

    this.client.ping({
      requestTimeout: 30000,
    })
      .then(res => logger.info('Elasticsearch cluster is ok '))
      .catch(error => logger.error('Elasticsearch cluster is down!' + error));

    this.client.cluster.health()
      .then(res => logger.info(chalk.keyword(res.status)(`Elasticsearch cluster health is ${res.status}`) ))
      .catch(err => logger.error(err));
  }

  async create(mapping) {
    try {
      const res = await this.client.indices.exists({
        index: this.index,
      });

      if (!res) {

        const createdIndex = await this.client.indices.create({
          index: this.index,
          body: mapping
        });

        if (createdIndex.acknowledged) {

          const bulk = [];

          const dataset = await this.model.find({});


          dataset.forEach(data => {
            bulk.push({
              index: { _index: this.index }
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

          logger.error(` Elasticsearchindex ${this.index}  creation failed`)

        }
      
      } else {
        logger.info(` ✔ ️Elasticsearch index ${this.index} exits`);
      }
    } catch (error) {
      logger.error(error)
    }
  }

  search(indexName,indexType,body){

    return this.client.search({
      index: indexName,
      type: indexType,
      body
    })

  }
}

module.exports = ElasticsearchService;
