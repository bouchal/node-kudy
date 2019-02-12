import {Application, Request, Response, Router} from "express";
import RouteParams from "../../RouteParams";

export default async (parentRouter: Router | Application, params: RouteParams) => {
    parentRouter.use((req: Request, res: Response, next) => {
        req.headers['x-async-header'] = 'OK';
        next();
    });

    return parentRouter;
}