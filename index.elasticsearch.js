var elasticsearch = require('elasticsearch');
const logger = require('./config/winston');

class ElasticsearchService {
  constructor(index, model) {
    this.index = index;
    this.model = model;
    this.client = new elasticsearch.Client({
      host: 'localhost:9200',
      auth: {
        username: 'elastic',
        password: 'changeme',
      },
    });

    this.client.ping({
      requestTimeout: 30000,
    })
    .then(res=> logger.info('Elasticsearch cluster is ok ') )
    .catch(error=>logger.error('Elasticsearch cluster is down!' + error));

    this.client.cluster.health()
            .then(res => logger.info('cluster health is ' +  res.status))
            .catch(err => logger.error(err));
  }

  async create() {
    try {
      const res = await this.client.indices.exists({
        index: this.index,
      });

      if (!res) {
        const accounts = await this.model.find({});
        console.log('not exits');
      } else {
        console.log('index already exits');
      }
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = ElasticsearchService;
