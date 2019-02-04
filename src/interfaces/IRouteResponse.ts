import {Response} from "express";

export default interface IRouteResponse {
    /**
     * Sent response to response object passed from express.
     */
    sendToResponse(res: Response): Promise<void>;
}
