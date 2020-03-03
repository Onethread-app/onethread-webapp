module.exports.accountMapping = {
  "settings": {
    "analysis": {
      "analyzer": {
        "my_email_analyzer": {
          "type": "custom",
          "tokenizer": "uax_url_email",
          "filter": ["lowercase", "stop"]
        }
      }
    }
  },
  "mappings": {
      "properties": {
        "mongo_id": { "type": "text" },
        "name": { "type": "text" },
        "email": { "type": "text", "analyzer": "my_email_analyzer" },
        "firstName": { "type": "text" },
        "lastName": { "type": "text" }
      }
  }
}


module.exports.accountStructure = (data) => {
  return {
    mongo_id: data._id.toString(),
    name: data.name,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName
  }
}

module.exports.skillMapping = {
  "mappings": {
    "properties": {
      "mongo_id" : { "type": "text"},
      "name" : { "type": "text"}
    }
  }
}

module.exports.skillStructure = (data) => {
  return {
    mongo_id: data._id.toString(),
    name: data.name,
  }
}
