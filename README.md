# file-to-mongodb-cli

file-to-mongodb-cli is a Node.js command-line interface (CLI) tool designed to easily import data within chunks from large files, such as Excel, CSV, or JSON, into a MongoDB collection.

## Installation

```bash
$ npm i -g file-to-mongodb-cli
```

## Running the app

```bash
# Only sending file
$ ftmon -i ./file/file.csv

# File and db uri
$ ftmon -i ./file/file.csv -u <mongoDbURI>

# File, uri and collection
$ ftmon -i ./file/file.csv -c <collection-name> -u <mongoDbURI>

# Show current db connection
$ ftmon --db
```
