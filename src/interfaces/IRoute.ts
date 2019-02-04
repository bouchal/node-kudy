import {ClientRequest, ServerResponse} from "http";
import IRouteResponse from "./IRouteResponse";
import {Request, Response} from "express";

export default interface IRoute {
    /**
     * Return route method type (GET, POST etc.)
     */
    method: string;

    /**
     * Return route public path.
     */
    path: string;

    /**
     * In case, that route is added to some router with prefix, we can override this method to return
     * actual full path.
     */
    fullPath: string;

    /**
     * Return JSON schema for validation input data in body of request.
     * If it return NULL, input validation is disabled.
     * You can't use it for GET.
     */
    bodySchema: object | null | undefined;

    /**
     * Return JSON schema for validation input data in query of request.
     * If it return NULL, input validation is disabled.
     */
    querySchema: object | null | undefined;

    /**
     * Return JSON schema for validation input data in query of request.
     * If it return NULL, input validation is disabled.
     */
    parametersSchema: object | null | undefined;

    /**
     * Return express middleware or array with multiple middleware functions which is called right before
     * request handler. It means, that this middleware is called after input validation.
     *
     * If you return null, middleware will be ignored.
     */
    middleware: null | undefined | Function | Array<Function>;

    /**
     * Handle Request
     */
    handler(req: Request, res: Response): Promise<IRouteResponse> | IRouteResponse;

    /**
     * Return express middleware or array with multiple middleware functions which is called right after
     * endpoint is called. It means, that this middleware is called before input validation.
     *
     * If you return null, middleware will be ignored.
     */
    preMiddleware: null | undefined | Function | Array<Function>;
}