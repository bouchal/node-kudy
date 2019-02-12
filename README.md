# kudy

Routes loader defined in folder structure.

## Usage

### Loader initialization 

```typescript
import express from "express";
import Loader from "kudy"

class RouteParams {
    // Here you can define everything, what you want pass to route constructor
    get envName() {
        return "development"
    }
}

const params = new RouteParams();

const routesLoader = new Loader<RouteParams>(params);

const app = express();

routesLoader.appendRoutesFromDir(app, './router');
```


## Routes definition

Every route should be defined in directory you choose. In our example it is `./router`.
And every file is equivalent of one route.

So just create new JS file with class extended predefined abstract route `AbstractRoute` and it will be loaded automatically.

> If you want to ignore some files or dirs in structure, just name them with prefix `_` (`_ignoredDir`) or `.` (`.ignored_file`)  

But you need to follow some rules. If you don't, program will throw Errors and tell you what to do.

### What rules?

- Implement getter `method` to return string with route method (`POST`, `GET` etc.)
- Implement getter `path` to return string with express path (e.g. `/0/post/:postId`)
- Implement method `handler` which is called after all middleware. And it must return extended instance of class
`AbstractResponse` or it's descendant. You can find more at *Response* section bellow.

So new Route could looks like this:

```typescript
import { Request, Response } from "express";
import { AbstractRoute, JsonResponse } from "kudy";

export default class PostData extends AbstractRoute {
    get method() {
        return 'GET';
    }

    get path() {
        return '/0/hello-world';
    }

    async handler(req: Request, res: Response) {
        return await new JsonResponse({
            text: 'Hello world'
        });
    }
}
```

### Route functionality

As I mentioned above, to route constructor is passed object selected as params. So you can save them as
"protected" variables and work with them in `handler` method.

For example:

```typescript
import { Request, Response } from "express";
import { AbstractRoute, JsonResponse } from "kudy";

class PostData extends AbstractRoute {
    protected envName: string;
    
    constructor(params: RouteParams) {
        super();

        this.envName = params.envName;
    }

    get method() {
        return 'GET';
    }

    get path() {
        return '/0/post/:postId';
    }

    async handler(req: Request, res: Response) {
        return new JsonResponse({
            env_name: this.envName
        });
    }
}

module.exports = PostData;
```


### Route input validation

Microservices need to work with data and must process data which is passed to services via input.
For that is our routes prepared for passing validation JSON schemas directly in route definition.

You can again override schema methods depends of what input you wanna validate. Each of this method should return 
JSON-schema definition. Details is in documentation here: http://json-schema.org

- __BODY__
  - It's data passed in request body when you send `POST` or `PUT` request (and some others).
  - *Getter:* `bodySchema`
- __PARAMETERS__
  - It's data passed in URI directly in path. For example: `/0/posts/:postId`, where `postId` is parameter.
  - *Getter:* `parametersSchema`
- __QUERY__
  - It's data passed in URI after question mark (`?`). For example: `/0/posts?access_token=token`, where `access_token`
  is parameter in query.
  - *Getter:* `querySchema`
  
For example:

```typescript
import { Request, Response } from "express";
import { AbstractRoute, EmptyResponse } from "kudy";

class PostData extends AbstractRoute {
    get method() {
        return 'GET';
    }

    get path() {
        return '/0/post/:postId';
    }

    get parametersSchema() {
        return {
            type: 'object',
            properties: {
                postId: {
                    type: 'number'
                }
            },
            required: ['postId']
        }
    }

    async handler(req: Request, res: Response) {
        return new EmptyResponse();
    }
}

module.exports = PostData;
```


### Route middleware

In route definition you can define one or multiple middleware which is called before request handler.

Again you can define them via overriding getters. In this case it's `middleware` and `preMiddleware`.

Difference between them is that middleware defined in `preMiddleware` is called right after request touch server.
It's useful for example for authorization request, where even input validation response should be security issue.

Middleware defined in method `getMiddleware` is called after validation and right after that is called request handler.

```typescript
import { Request, Response } from "express";
import { AbstractRoute, JsonResponse } from "kudy";

export default class PostData extends AbstractRoute {
    get middleware(): Function | Array<Function> | null | undefined {
        return (req: Request, res: Response, next: (err?: any) => {}) => {
            req.headers['x-middleware'] = 'OK';
            next();
        }
    }
    
    get method() {
        return 'GET';
    }

    get path() {
        return '/0/hello-world';
    }

    async handler(req: Request, res: Response) {
        return await new JsonResponse({
            text: 'Hello world'
        });
    }
}
``` 

### Routes grouping

Many times you need to group routes. Simplest reason for that is just clear file structure. More complex
reason is that you need to apply more complex rules to routes in group via separated router which is 
use in parent router.

Our RouterLoader can help in both scenarios.

#### Route file structure

Loader is set for recursive loading on routes from each subdirectories in routes directory and also
their subdirectories.

You can create files with any name but except `index.ts` etc. This file name is reserved for router
decorator which I will describe bellow.

So your route structure could looks like this:

```text
└── routes
    ├── Posts
    │   ├── Detail
    │   │   └-─ GetPostDetail.ts
    │   └── GetPostsList.ts
    └── GetPing.ts
```

### Router decorator

In each directory of you routes structure, you can create `index.ts` file which contain and exports only
one method, witch is used for router decorating and also it should return this same or some other express
router. To router will append every route in this directory. 

If you don't define new router or don't create `index.ts` file, it will be use same router as in parent
directory.

You can use __RouterParams__ variables in decorator as in routes definition.

Router decorator can looks like this:

```typescript
module.exports = (parentRouter: Router | Application, params: RouteParams) => {
    const router = express.Router();

    parentRouter.use('/0', router);

    return router;
};
```

And each route in this directory will have path prefix `/0`.

## Routes testing

For testing use package [kudy-tester](https://www.npmjs.com/package/kudy-tester).

## Responses

Every new route need to have method `handler` which return promise and as it's resolver must be instance
of class extended `AbstractResponse`.

You can create your own responses for some abstract programing, for unify some response groups or just for adding some
header or change response code.

Custom response need only one method and it's `sendToResponse(res)`. Only parameter passed to this method is Express
response object and through it you can send custom response as you want.

For example:

```typescript
import { Response } from "express";

export default class NotFoundResponse {
    sendToResponse(res: Response) {
        res
            .status(404)
            .send('Item was not found.');
    }
}
```