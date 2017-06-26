# loopback-connector-gdatastore
Google DataStore connector for loopback

## Installation

    npm install loopback-connector-gdatastore --save

## Setup datasources.json
```
  "gdatastore": {
    "name": "gdatastore",
    "connector": "loopback-connector-gdatastore",
    "projectId": "gcloud-project-id",
    "namespace": "datastore-namespace"
  }
```

## Currently working operations

    find, findById, create, replaceById, deleteById

## Setup model-config.json
```
"options": {
    "remoting": {
      "sharedMethods": {
        "*": false,
        "find": true,
        "create": true,
        "findById": true,
        "deleteById": true,
        "replaceById": true
      }
    }
  }
```

## Currently filtering operators
    and
  *I hope enable more filtering options in few days*

*I'm currently working on this connector, so I will add more operations in few days*