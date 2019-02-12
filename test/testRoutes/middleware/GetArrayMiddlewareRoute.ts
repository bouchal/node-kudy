import {AbstractResponse, AbstractRoute, JsonResponse} from "../../../src/kudy";
import * as e from "express";
import {Request, Response} from "express";

export default class GetArrayMiddlewareRoute extends AbstractRoute {
    handler(req: e.Request, res: e.Response): Promise<AbstractResponse> | AbstractResponse {
        return new JsonResponse({
            headers: req.headers
        })
    }


    get middleware(): Function | Array<Function> | null | undefined {
        return [
            (req: Request, res: Response, next: (err?: any) => {}) => {
                req.headers['x-middleware-1'] = 'OK';
                next();
            },
            (req: Request, res: Response, next: (err?: any) => {}) => {
                req.headers['x-middleware-2'] = 'OK';
                next();
            },
        ]
    }

    get preMiddleware(): Function | Array<Function> | null | undefined {
        return [
            (req: Request, res: Response, next: (err?: any) => {}) => {
                req.headers['x-pre-middleware-1'] = 'OK';
                next();
            },
            (req: Request, res: Response, next: (err?: any) => {}) => {
                req.headers['x-pre-middleware-2'] = 'OK';
                next();
            },
        ]
    }

    get method(): string {
        return "GET";
    }

    get path(): string {
        return "/array-middleware";
    }

}