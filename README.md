# Local Development Commands
Start Typescript with `npm run watch`

Run tests with `npm run test`

Run local server with `npm run start`

Run local server with hot reloading with `npm run dev`

List all linting issues with `npm run lint` *

Attempt to auto fix linting issues with `npm run fix`

\* highly recommend installing the `vscode-eslint` package for realtime linting highlights

# Project layout

```
core-api-node.js/
├── node_modules/
├── dist/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── config/config.ts - maybe some in-VC config stuff here (like laravels?)
│   ├── routes/ - define method / paths / controller function used here
│   │   ├── discussionRoutes.ts
│   │   ├── customerRoutes.ts
│   │   └── ...
│   ├── controllers/ - define business logic here, these should expose RequestHandlers that the routes can use
│   │   ├── discussionController.ts 
│   │   ├── customerController.ts
│   │   └── ...
│   ├── models/ - define models here, possibly prisma stuff or a wrapper around them???
│   │   ├── discussion.ts
│   │   ├── customer.ts
│   │   └── ...
│   └── repositories/ - define business logic that interacts with the db here
│       ├── discusionRepository.ts
│       ├── customerRepository.ts
│       └── ...
└── tests/ - tests go here. Note these are not ts as compilation can abstract away the things you're testing
    ├── feature/
    │   ├── discussionController.test.js
    │   ├── discussionrepository.test.js
    │   └── ...
    └── unit/
        ├── discusionRepository.test.js
        └── ... 
```

# Local postgres

Install with `brew install postgresql`

Start with `brew services start postgresql`

Connect to cli with `psql <database>`

Show existing databases with `\l`

By default a `postgres` database will exist with your username as the owner

```bash
gavin@LHS-MAC44 core-api-node.js % psql postgres
psql (14.6 (Homebrew))
Type "help" for help.

postgres=# \l
                         List of databases
   Name    | Owner | Encoding | Collate | Ctype | Access privileges 
-----------+-------+----------+---------+-------+-------------------
 postgres  | gavin | UTF8     | C       | C     | 
 template0 | gavin | UTF8     | C       | C     | =c/gavin         +
           |       |          |         |       | gavin=CTc/gavin
 template1 | gavin | UTF8     | C       | C     | =c/gavin         +
           |       |          |         |       | gavin=CTc/gavin
(3 rows)
```

# prisma migrations

//TODO check this. Seems very hands on and manual. Not automation friendly. Should migrations be commited to VC?

Manually connect to the local postgres and create a new database `core-api`

Compose .env variable DATABASE_URL like so:

```
DATABASE_URL="postgres://<your-local-username>@127.0.0.1:5432/<database-name>"
```

Delete any prisma/migrations files and the migration lock file (leave the schema.prisma file)

Run `npx prisma migrate dev --name init`

Done.

# Migrations

This will require:

- Monolith database running locally

```bash
node ./dist/scripts/ReplicateMonolithCustomers.js
node ./dist/scripts/ReplicateMonolithDiscussions.js
node ./dist/scripts/ReplicateMonolithCustomerDiscussions.js
node ./dist/scripts/ReplicateMonolithMessages.js
node ./dist/scripts/ReplicateMonolithTrips.js
```



