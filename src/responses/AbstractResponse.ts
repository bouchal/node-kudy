import {Response} from "express";

export default abstract class AbstractResponse {
    /**
     * Sent response to response object passed from express.
     */
    abstract sendToResponse(res: Response): Promise<void>;
}