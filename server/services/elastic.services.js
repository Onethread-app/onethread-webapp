const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  hosts: ['http://localhost:9200'],
});

const INDEX_NAME = 'skillarea';
const INDEX_TYPE = '_doc';

module.exports.indexExits = (index_name) => {

    return client.indices.exists({
        index: index_name
    });

}

module.exports.addDocument = (index_name,index_type,document) => {
    return client.index({
        index: index_name,
        type: index_type,
        body: document,
        refresh: "true"
    });
}

module.exports.search = (index_name,index_type,body,filter_path) => {
    return client.search({
        index: index_name,
        type: index_type,
        body: body,
        filter_path: filter_path 
    })

}
