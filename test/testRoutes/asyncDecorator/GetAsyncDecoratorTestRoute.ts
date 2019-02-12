import {AbstractResponse, AbstractRoute, JsonResponse} from "../../../src";
import * as e from "express";
import {Request, Response} from "express";

export default class GetArrayMiddlewareRoute extends AbstractRoute {
    handler(req: e.Request, res: e.Response): Promise<AbstractResponse> | AbstractResponse {
        return new JsonResponse({
            headers: req.headers
        })
    }

    get method(): string {
        return "GET";
    }

    get path(): string {
        return "/async-decorator-test";
    }

}