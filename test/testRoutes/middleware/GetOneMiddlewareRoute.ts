import {AbstractResponse, AbstractRoute, JsonResponse} from "../../../src";
import * as e from "express";
import {Request, Response} from "express";

export default class GetOneMiddlewareRoute extends AbstractRoute {
    handler(req: e.Request, res: e.Response): Promise<AbstractResponse> | AbstractResponse {
        return new JsonResponse({
            headers: req.headers
        })
    }


    get middleware(): Function | Array<Function> | null | undefined {
        return (req: Request, res: Response, next: (err?: any) => {}) => {
            req.headers['x-middleware'] = 'OK';
            next();
        }
    }

    get preMiddleware(): Function | Array<Function> | null | undefined {
        return (req: Request, res: Response, next: (err?: any) => {}) => {
            req.headers['x-pre-middleware'] = 'OK';
            next();
        }
    }

    get method(): string {
        return "GET";
    }

    get path(): string {
        return "/one-middleware";
    }

}