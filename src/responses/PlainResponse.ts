import {Response} from "express";
import EmptyResponse from "./EmptyResponse";

export default class PlainResponse extends EmptyResponse {
    protected body: string;

    constructor(body: string = '', statusCode: number = 200) {
        super(statusCode);
        this.body = body;
    }

    public async sendToResponse(res: Response): Promise<void> {
        res.status(this.statusCode);
        res.send(this.body);
    }
}