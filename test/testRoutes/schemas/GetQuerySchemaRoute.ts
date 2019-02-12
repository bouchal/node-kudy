import {AbstractResponse, AbstractRoute, EmptyResponse} from "../../../src";
import * as e from "express";

export default class GetQuerySchemaRoute extends AbstractRoute {
    handler(req: e.Request, res: e.Response): Promise<AbstractResponse> | AbstractResponse {
        return new EmptyResponse();
    }

    get querySchema(): object | null | undefined {
        return {
            type: "object",
            properties: {
                id: {
                    type: "integer"
                }
            },
            required: [ 'id' ]
        }
    }

    get method(): string {
        return "GET";
    }

    get path(): string {
        return "/query-schema";
    }

}