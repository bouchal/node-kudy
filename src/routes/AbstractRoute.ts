import {Request, Response} from "express";
import AbstractResponse from "../responses/AbstractResponse"

export default abstract class AbstractRoute {
    /**
     * Return route method type (GET, POST etc.)
     */
    abstract get method(): string;

    /**
     * Return route public path.
     */
    abstract get path(): string;

    /**
     * In case, that route is added to some router with prefix, we can override this method to return
     * actual full path.
     *
     * You need it if you use RouteTester.
     */
    get fullPath(): string {
        return this.path;
    }

    /**
     * Return JSON schema for validation input data in body of request.
     * If it return NULL, input validation is disabled.
     * You can't use it for GET.
     */
    get bodySchema(): object | null | undefined {
        return undefined;
    }

    /**
     * Return JSON schema for validation input data in query of request.
     * If it return NULL, input validation is disabled.
     */
    get querySchema(): object | null | undefined {
        return undefined;
    }

    /**
     * Return JSON schema for validation input data in query of request.
     * If it return NULL, input validation is disabled.
     */
    get parametersSchema(): object | null | undefined {
        return undefined
    }

    /**
     * Return express middleware or array with multiple middleware functions which is called right before
     * request handler. It means, that this middleware is called after input validation.
     *
     * If you return null, middleware will be ignored.
     */
    get middleware(): null | undefined | Function | Function[] {
        return undefined;
    }

    /**
     * Return express middleware or array with multiple middleware functions which is called right after
     * endpoint is called. It means, that this middleware is called before input validation.
     *
     * If you return null, middleware will be ignored.
     */
    get preMiddleware(): null | undefined | Function | Function[] {
        return undefined;
    }

    /**
     * Handle Request
     */
    abstract handler(req: Request, res: Response): Promise<AbstractResponse> | AbstractResponse;
}