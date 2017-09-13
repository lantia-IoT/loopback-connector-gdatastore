# loopback-connector-gcdatastore
Google Cloud Datastore Connector for Loopback.io

## Installation

    npm install loopback-connector-gcdatastore --save

## Setup datasources.json
```json
  "gcdatastore": {
    "name": "gcdatastore",
    "connector": "loopback-connector-gcdatastore",
    "projectId": "gcloud-project-id",
    "namespace": "datastore-namespace"
  }
```

## Setup model-config.json
```json
  "options": {
    "remoting": {
      "sharedMethods": {
        "*": false,
        "find": true,
        "create": true,
        "update": true,
        "findById": true,
        "deleteById": true,
        "replaceById": true,
        "prototype.patchAttributes": true
      }
    }
  }
```

## To support relations in order to create Key references in datastore
*Add the following configuration to your model*
```json
  "properties": {
    ...
    "parent": {
      "type": "string",
      "required": true
    }
  },
  "relations": {
    "parentEntity": {
      "model": "parentEntityModel",
      "foreignKey": "parent",
      "type": "belongsTo"
    }
  }
```

## Currently working operations
    find, findById, create, update, replaceById, deleteById

## Currently filtering operators
    and, order