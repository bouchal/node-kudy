import {Application, Router} from "express";
import RouteParams from "../../RouteParams";

export default (parentRouter: Router | Application, params: RouteParams) => {
    const router = Router();

    parentRouter.use('/v0', router);

    return router;
}