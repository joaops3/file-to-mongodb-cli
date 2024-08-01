# file-to-mongodb-cli

file-to-mongodb-cli is a Node.js command-line interface (CLI) tool designed to easily import data from large files, such as Excel, CSV, or JSON, into a MongoDB collection.

## Installation

```bash
$ npm i -g file-to-mongodb-js
```

## Running the app

```bash
# Only sending file
$ ftm -i ./file/file.csv

# File and db uri
$ ftm -i ./file/file.csv -u <mongoDbURI>

# File, uri and collection
$ ftm -i ./file/file.csv -c <collection-name> -u <mongoDbURI>

# Show current db connection
$ ftm -db
```
