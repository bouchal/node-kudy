import {AbstractResponse, AbstractRoute, EmptyResponse} from "../../../src";
import * as e from "express";

export default class GetTestRoute extends AbstractRoute {
    handler(req: e.Request, res: e.Response): Promise<AbstractResponse> | AbstractResponse {
        return new EmptyResponse();
    }

    get method(): string {
        return "GET";
    }

    get path(): string {
        return "/test";
    }

}