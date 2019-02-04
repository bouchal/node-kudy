import {Response} from "express";
import EmptyResponse from "./EmptyResponse";

export default class JsonResponse extends EmptyResponse {
    protected jsonBody: object;

    constructor(body: object = {}, statusCode: number = 200) {
        super(statusCode);
        this.jsonBody = body;
    }


    async sendToResponse(res: Response): Promise<void> {
        res.status(this.statusCode);
        res.json(this.jsonBody);
    }
}