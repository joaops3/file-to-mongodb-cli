# file-to-mongodb-cli

file-to-mongodb-cli is a Node.js command-line interface (CLI) tool designed to easily import data within chunks from large files, such as Excel, CSV, or JSON, into a MongoDB collection.

## Installation

```bash
$ npm i -g file-to-mongodb-cli
```

## Running the app

```bash
# Only sending file
$ ftmon -i ./files/file.csv

# Passing File and Uri
$ ftmon -i ./files/file.csv -u <mongoDbURI>

# Passing File, Uri and Collection
$ ftmon -i ./files/file.csv -c <collection-name> -u <mongodb-URI>

# Show current db connection
$ ftmon --db
```
