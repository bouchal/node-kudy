import {Application, Request, Response, Router} from "express";
import {Stats} from 'fs';
import * as path from 'path';
import LoaderError from "./errors/LoaderError";
import AbstractRoute from "./routes/AbstractRoute";
import * as Ajv from "ajv";
import InvalidInputError from "./models/InvalidInputError";
import AbstractResponse from "./responses/AbstractResponse";
import JsonResponse from "./responses/JsonResponse";

const fs = require('fs');

type InvalidInputHandler = (err: InvalidInputError) => Promise<AbstractResponse> | AbstractResponse;
type ErrorCatchHandler = (err: Error) => Promise<AbstractResponse> | AbstractResponse;

const ajv = new Ajv({coerceTypes: true});

export type Options = {
    /**
     * If handler throw error and it's not caught on other levels, this is last option how to handle it.
     *
     * @param err
     */
    errorCatchHandler?: ErrorCatchHandler;

    /**
     * Invalid request to routes with defined validation schemas will be rejected through this response.
     */
    invalidInputHandler?: InvalidInputHandler;

    /**
     * Load routes recursively through directories.
     */
    recursive?: boolean
}

export default class Loader<T = any> {
    protected routeConstructParams?: T;
    protected options: Options = {
        recursive: true
    };

    public constructor(
        routeConstructParams?: T,
        options: Options = {}
    ) {
        this.routeConstructParams = routeConstructParams;

        this.options = {
            ...this.options,
            ...options
        }
    }

    /**
     * Append router passed in parameter by routes defined in specific directory.
     *
     * @param parentRouter
     * @param dirPath
     */
    async appendRoutesFromDir(parentRouter: Router | Application, dirPath: string): Promise<Router | Application> {
        const dirs: string[] = [];
        const files: string[] = [];

        const dirItems = (await this.getDirItems(dirPath))
            .filter((item) => ['.', '_'].indexOf(item[0]) === -1) // Skip items started with `_` or `.`
            .map((itemPath) => path.resolve(`${dirPath}/${itemPath}`)); // Modify item names to full path


        await this.separateDirItemsToTypes(dirItems, dirs, files);

        /**
         * Get router for appending by routes.
         * You can have decorate router in 'index.js' of each directory with exporting function, which expected
         * parent router as first parameter.
         */
        const router = await this.getCustomRouterFromDir(parentRouter, dirPath);

        /**
         * When we initialize each route, we wanna skip its 'index', because there is not route, but router
         * decorator.
         */
        const dirRequireResolve = this.getDirResolver(dirPath);

        /**
         * Start routes loading
         */
        for (const filePath of files) {
            /**
             * We wanna skip index.js etc.
             */
            if (filePath === dirRequireResolve) {
                continue;
            }

            // Load route definition
            const route = await this.getRouteInstanceByPath(filePath);

            this.initRouteToRouter(router, route);
        }

        if (this.options.recursive) {
            for (const dirPath of dirs) {
                await this.appendRoutesFromDir(router, dirPath);
            }
        }

        return router;
    }

    /**
     * Add instance of Abstract route to router.
     *
     * @param router
     * @param {AbstractRoute} route
     * @private
     */
    protected initRouteToRouter(router: any, route: AbstractRoute) {
        const method = route.method.toLowerCase();

        router[method](route.path, this.getRouteMiddlewareArray(route), this.getRouteHandler(route));
    }

    /**
     * Require Route from file path.
     * It should be class extended AbstractRoute.
     *
     * @param routePath
     */
    protected async getRouteInstanceByPath(routePath: string): Promise<AbstractRoute> {
        const routeDefinition = await import(routePath);
        const initializer = routeDefinition.default || routeDefinition;

        let routeInstance;

        try {
            routeInstance = await (new initializer(this.routeConstructParams));
        } catch (err) {
            if (err.message.indexOf('is not a constructor') === -1) {
                throw err;
            }

            routeInstance = await initializer(this.routeConstructParams);
        }

        if (!(routeInstance instanceof AbstractRoute)) {
            throw new LoaderError(`Route "${routePath}' is not instance of AbstractRoute`);
        }

        return routeInstance;
    }

    /**
     * Return instance from index.js of Dir.
     * It should be always instance of Express router.
     *
     * Return null if required file (mostly index.js) don't exist.
     *
     * @param parentRouter
     * @param dirPath
     */
    protected async getCustomRouterFromDir(parentRouter: Router | Application, dirPath: string): Promise<Router | Application> {
        let routerFactory;

        try {
            routerFactory = await import(dirPath);
        } catch (e) {
            return parentRouter;
        }

        const routerInitializer = routerFactory.default || routerFactory;

        return await routerInitializer(parentRouter, this.routeConstructParams);
    }

    /**
     * Load info for each item in directory and fill dir and files arrays in parameters.
     *
     * @param dirItems
     * @param dirs
     * @param files
     */
    protected async separateDirItemsToTypes(dirItems: string[], dirs: string[], files: string[]) {
        for (const dirItem of dirItems) {
            const stat = await this.getDirItemStats(dirItem);

            if (stat.isDirectory()) {
                dirs.push(dirItem);
            } else {
                files.push(dirItem);
            }
        }
    }

    /**
     * We need to get all items from directory.
     *
     * @param dirPath
     */
    protected getDirItems(dirPath: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(dirPath, (err: Error, items: string[]) => {
                if (err) {
                    return reject(err);
                }

                resolve(items);
            })
        })
    }

    /**
     * Return dir item stats base on path.
     *
     * @param fullPath
     */
    protected getDirItemStats(fullPath: string): Promise<Stats> {
        return new Promise<Stats>((resolve, reject) => {
            fs.stat(fullPath, (err: Error, stats: Stats) => {
                if (err) {
                    return reject(err);
                }

                resolve(stats);
            })
        })
    }


    /**
     * Return all middleware created to each route.
     *
     * @param route
     */
    protected getRouteMiddlewareArray(route: AbstractRoute): Function[] {
        const routePreMiddleware = route.preMiddleware || [];
        const routeMiddleware = route.middleware || [];

        const middlewareArray = [
            ...(Array.isArray(routePreMiddleware) ? routePreMiddleware : [routePreMiddleware])
        ];

        const dataSchema = route.bodySchema;
        const querySchema = route.querySchema;
        const parametersSchema = route.parametersSchema;

        if (dataSchema) {
            const getBodyFromRequest = (req: Request) => {
                return req.body || {};
            };

            middlewareArray.push(this.getValidationMiddleware(getBodyFromRequest, dataSchema, 'BODY'));
        }

        if (querySchema) {
            const getQueryFromRequest = (req: Request) => {
                return req.query;
            };

            middlewareArray.push(this.getValidationMiddleware(getQueryFromRequest, querySchema, 'QUERY'));
        }

        if (parametersSchema) {
            const getParametersFromRequest = (req: Request) => {
                return req.params;
            };

            middlewareArray.push(this.getValidationMiddleware(getParametersFromRequest, parametersSchema, 'PARAMETERS'));
        }

        return [
            ...middlewareArray,
            ...(Array.isArray(routeMiddleware) ? routeMiddleware : [routeMiddleware])
        ];
    }

    /**
     * Create middleware for testing validation json schema.
     *
     * @param requestGetterValue
     * @param schema
     * @param sectionName
     * @return {function(*=, *=, *)}
     */
    protected getValidationMiddleware(requestGetterValue: (req: Request) => {}, schema: object, sectionName: string): Function {
        const validate = ajv.compile(schema);

        return (req: Request, res: Response, next: Function) => {
            const data = requestGetterValue(req);

            if (!validate(data)) {
                const error = new InvalidInputError(sectionName, validate.errors, schema);

                Promise.resolve(
                    (this.options.invalidInputHandler
                        ? this.options.invalidInputHandler
                        : this.defaultInvalidInputHandler)(error))
                    .then(async (response: AbstractResponse) => {
                        await response.sendToResponse(res);
                    });

                return;
            }

            next();
        }
    };

    protected getDirResolver(dirPath: string) {
        try {
            return require.resolve(dirPath)
        } catch (e) {
            return null;
        }
    }

    /**
     * Common handler for route.
     * it's called for every route and handle all necessary things before it's passed to handlers of each specific routes.
     *
     * @param route
     */
    protected getRouteHandler(route: AbstractRoute) {
        return async (req: Request, res: Response) => {
            try {
                const response = await route.handler(req, res);

                return response.sendToResponse(res);
            } catch (e) {
                Promise.resolve(
                    (this.options.errorCatchHandler
                        ? this.options.errorCatchHandler
                        : this.defaultErrorCatchHandler)(e))
                    .then(async (response: AbstractResponse) => {
                        await response.sendToResponse(res);
                    });

                return;
            }
        }
    };

    protected async defaultErrorCatchHandler(error: Error) {
        const body = {
            error: 'SERVER_ERROR',
            error_description: error.message,
            error_stack: error.stack
        };

        return new JsonResponse(body, 500);
    }

    protected async defaultInvalidInputHandler(error: InvalidInputError) {
        const body = {
            error: 'INVALID_INPUT',
            error_description: `Input data in ${error.sectionName} section are wrong or missing`,
            error_validation: {
                errors: error.errors,
                schema: error.schema
            }
        };

        return new JsonResponse(body, 422);
    }
}