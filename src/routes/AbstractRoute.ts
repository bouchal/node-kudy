import IRouteResponse from "../interfaces/IRouteResponse";
import IRoute from "../interfaces/IRoute";
import {Request, Response} from "express";

export default abstract class AbstractRoute implements IRoute {
    /** @inheritDoc */
    abstract get method(): string;

    /** @inheritDoc */
    abstract get path(): string;

    /** @inheritdoc */
    get fullPath(): string {
        return this.path;
    }

    /** @inheritDoc */
    get bodySchema(): object | null | undefined {
        return undefined;
    }

    /** @inheritDoc */
    get querySchema(): object | null | undefined {
        return undefined;
    }

    /** @inheritDoc */
    get parametersSchema(): object | null | undefined {
        return undefined
    }

    /** @inheritDoc */
    get middleware(): null | undefined | Function | Array<Function> {
        return undefined;
    }

    /** @inheritDoc */
    get preMiddleware(): null | undefined | Function | Array<Function> {
        return undefined;
    }

    /** @inheritDoc */
    abstract handler(req: Request, res: Response): Promise<IRouteResponse> | IRouteResponse;
}