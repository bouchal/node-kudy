import {AbstractResponse, AbstractRoute, EmptyResponse} from "../../src";
import * as e from "express";

class getAsyncRoute extends AbstractRoute {
    handler(req: e.Request, res: e.Response): Promise<AbstractResponse> | AbstractResponse {
        return new EmptyResponse();
    }

    get method(): string {
        return "GET";
    }

    get path(): string {
        return "/async";
    }
}

export default async () => {
    return await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(new getAsyncRoute())
        }, 200)
    })
}
