module.exports.memberMapping = {
  "mappings": {
    "properties": {
      "mongo_id" : { "type": "text"},
      "account" : {"type": "nested" , "include_in_parent": true },
      "company" : { "type": "text"}
    }
  }
}

module.exports.memberStructure = (data) => {
  return {
    mongo_id: data._id.toString(),
    account: data.account,
    company: data.company,
  }
}



module.exports.messageMapping = {
  "mappings": {
    "properties": {
      "mongo_id" : {"type": "text"},
      "room" : { "type": "text"},
      "account" : { "type": "text"},
      "chatkitId" :  { "type": "text"},
      "text" : {"type": "text"},
      "files" : {"type": "nested" , "include_in_parent": true },
      "type" : {"type": "text"}
    }
  }
}

module.exports.messageStructure = (data) => {
  return {
    mongo_id: data._id.toString(),
    room: data.room,
    account: data.account,
    chatkitId: data.chatkitId,
    text: data.text,
    type: data.type,
    files: data.files
  }
}


module.exports.accountMapping = {
  
  "settings": {
    "analysis": {
      "analyzer": {
        "email_analyzer" : {
          "tokenizer" : "uax_url_email" ,
          "filter": "lowercase"
        }
      }
    }
  }, 
  "mappings": {
    "properties": {
      "mongo_id" : { "type": "text"},
      "name" : { "type": "text" },
      "email" : {"type": "text" , "analyzer": "email_analyzer"},
      "firstName" : {"type": "text" },
      "lastName" : { "type": "text" }
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
