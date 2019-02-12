import {AbstractResponse, AbstractRoute, EmptyResponse} from "../../../src";
import * as e from "express";

export default class PostBodySchemaRoute extends AbstractRoute {
    handler(req: e.Request, res: e.Response): Promise<AbstractResponse> | AbstractResponse {
        return new EmptyResponse();
    }

    get bodySchema(): object | null | undefined {
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
        return "POST";
    }

    get path(): string {
        return "/body-schema";
    }

}