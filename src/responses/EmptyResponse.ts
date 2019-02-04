import IRouteResponse from "../interfaces/IRouteResponse";
import {Response} from "express";

export default class EmptyResponse implements IRouteResponse {
    protected statusCode: number;

    constructor(statusCode: number = 200) {
        this.statusCode = statusCode;
    }

    async sendToResponse(res: Response): Promise<void> {
        res.sendStatus(this.statusCode);
    }
}