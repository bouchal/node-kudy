import RouteParams from "../RouteParams";
import {Application, Request, Response, Router} from "express";

export default (parentRouter: Router | Application,  params: RouteParams) => {
    parentRouter.get(params.routerTestRoutePath, (req: Request, res: Response) => {
        res.sendStatus(200);
    });

    return parentRouter;
}