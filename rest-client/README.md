# FetchQ Rest Client

Provides a REST interface for managing a single database instance

## Work

You need `node:9.x` and a Postgres database with the FetchQ extension installed.

All the required enviroment variables are available in `.env` with their default
values, you can override those values in a `.env.local` file that will be gitignored.

```
yarn install
yarn start
```

## Test

You need the solution to be running on `http://localhost:8080`.  
In another terminal run:

```
yarn test
```

If you want to test against a custom installation run:

```
ROOT_URL=https://2895e30a.ngrok.io yarn test
```

## API

```
get://v1/init
<<< {
    "was_initialized": false
}

get://v1/info
<<< {
    "version": "0.0.1"
}

# create a new queue
post://v1/q 
>>> {
    "name": "foo"
}
<<< {
    "was_created": true,
    "queue_id": "1"
}

# drop an existing queue
delete://v1/q/:name
<<< {
    "was_dropped": true
}

# push a document into a queue
post://v1/q/:name
>>> {
    "subject": "foo"
}
```