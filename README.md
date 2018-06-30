# FetchQ - Node Client

## Configure & Connect

```
const client = require('fetchq')({
    // "winston" logger setup
    logLevel: 'error',

    // "pg" connection info (optional)
    connection: {
        host: 'XXX',
        port: 5432,
        database: 'fetchq',
        user: 'fetchq',
        password: 'fetchq',
    }

    // "pg connectionString (optional)
    connectionString: '',
})
```

Fetchq is a wrapper around [pg (node postgres)](https://www.npmjs.com/package/pg) and it aims to 
apply the very same rules for connection. So far Fetchq supports:

- environment variables
- programmatic info via `connection` setting
- connectionString

Please refer to the [pg documentation](https://node-postgres.com/features/connecting) for details.

---

## Queue Operations

### Create a new queue

### Destroy an existing queue

---

## Documents Operations

### Push a single document

### Push many documents in bulk

### Pick documents from the queue

---

## Register Workers

