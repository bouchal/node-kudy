import {AbstractResponse, AbstractRoute, EmptyResponse} from "../../src/kudy";
import * as e from "express";

export default class GetThrowError extends AbstractRoute {
    handler(req: e.Request, res: e.Response): Promise<AbstractResponse> | AbstractResponse {
        return new EmptyResponse();
    }


    get querySchema(): object | null | undefined {
        return {
            type: "object",
            properties: {
                id: {
                    type: "number"
                }
            },
            required: ['id']
        }
    }

    get method(): string {
        return "GET";
    }

    get path(): string {
        return "/invalid-schema";
    }

}