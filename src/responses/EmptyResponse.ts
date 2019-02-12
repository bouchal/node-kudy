import {Response} from "express";
import AbstractResponse from "./AbstractResponse";

export default class EmptyResponse implements AbstractResponse {
    protected statusCode: number;

    constructor(statusCode: number = 200) {
        this.statusCode = statusCode;
    }

    async sendToResponse(res: Response): Promise<void> {
        res.sendStatus(this.statusCode);
    }
}