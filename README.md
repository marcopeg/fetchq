# FetchQ - Node Client

Fetchq is a stateful queue system based on Postgres because it is reliable, fast,
and generally available in any cloud system or easy and cheap to run yourself.

Fetchq aims to solve a specific problem that I like to call **big calendar**.  
Do you need to run planned tasks for millions (or just a few) planned documents?
Yes, right? Then Fetchq is the tool you want to try out.

Here is a non-comprehensive list of problems that have successfully been solved with Fetchq:

- **time based data scraping:** want to check how John is performing on Instagram every second
  day, and you have 60 millions of "Johns" so you need to scale your workers horizonally?
- **event based data aggregation:** your user's data is spread in multiple relational data and you
  want to build a compehensive - ready to read - document to give to Elasticsearch (or just to
  send it out in a fast REST request) only when the data really change?
- **marketing activities:** do you want to send an email to your newly signed up users if they 
  casually forget to log-back-in after few days?
- **event based nitifications with canceling capabilities:** do you want to send out notifications
  that can be canceled if another event happen (subscribe/unsubscribe) few seconds later?

## Features

- workers are horizontally scalable by default - add as many as you want, the more the better
- exclusive access to tasks across workers in different machines - never do the same job twice!
- insanely easy to use NodeJS client - your 5 years old son can write workers too
- documents in queue have a unique subject (or "id") - if you push twice, you queue only once
- documents can be planned in time - the older planning date came first
- documents can be prioritized - higher priority came first (and beats the planning date too)
- every document can store a json payload to keep track of little things
- documents can be rescheduled for further execution
- documents can be dropped out the queue - so some other process can put them back in again
- documents can be marked as completed/killed so they will never be executed ever again
- (tough killed documents can be "resuscitated")
- documents can be rejected with an error, the errors are automatically stored for your o read
- tasks that are not completed in time are automatically re-scheduled for execution
- each queue has a custom error tolerance, if a document fails more than X times it gets killed

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

    // "pg" connectionString (optional)
    connectionString: '',

    // "pg" pool configuration (optional)
    pool: {}
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

