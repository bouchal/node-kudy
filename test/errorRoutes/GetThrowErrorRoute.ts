import {AbstractResponse, AbstractRoute, EmptyResponse} from "../../src/kudy";
import * as e from "express";

export default class GetThrowErrorRoute extends AbstractRoute {
    handler(req: e.Request, res: e.Response): Promise<AbstractResponse> | AbstractResponse {
        throw new Error('Wanted exception');
    }

    get method(): string {
        return "GET";
    }

    get path(): string {
        return "/throw-error";
    }

}