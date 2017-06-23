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

    all(), find(), findById()


*I'm currently working on this connector, I hope enable more operations in few days*