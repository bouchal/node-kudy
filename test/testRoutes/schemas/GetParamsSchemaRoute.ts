import {AbstractResponse, AbstractRoute, EmptyResponse} from "../../../src";
import * as e from "express";

export default class GetParamsSchemaRoute extends AbstractRoute {
    handler(req: e.Request, res: e.Response): Promise<AbstractResponse> | AbstractResponse {
        return new EmptyResponse();
    }

    get parametersSchema(): object | null | undefined {
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
        return "/parameters-schema/:id";
    }

}