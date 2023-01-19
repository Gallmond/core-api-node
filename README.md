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