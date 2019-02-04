import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);

import AbstractRoute from "./AbstractRoute";
import {ClientRequest, ServerResponse} from "http";
import IRouteResponse from "../interfaces/IRouteResponse";
import PlainResponse from "../responses/PlainResponse";
import {Request, Response} from "express";

const PRIMITIVE_METHOD = 'POST';
const PRIMITIVE_PATH = '/v0/primitive';

class PrimitiveRoute extends AbstractRoute {
    get method(): string {
        return PRIMITIVE_METHOD;
    }

    get path(): string {
        return PRIMITIVE_PATH;
    }

    handler(req: Request, res: Response): Promise<IRouteResponse> | IRouteResponse {
        return new PlainResponse();
    }
}

let testedRoute: PrimitiveRoute;

describe('AbstractRoute', function () {
    it('should be usable only with path, method and handler definition.', function () {
        testedRoute = new PrimitiveRoute();
    });

    it('should return correct path and method', function () {
        expect(testedRoute.method).to.be.equal(PRIMITIVE_METHOD);
        expect(testedRoute.path).to.be.equal(PRIMITIVE_PATH);
    });

    it('should return path as fullPath by default', function () {
        expect(testedRoute.fullPath).to.be.equal(testedRoute.path);
    });

    it('should return validation schemas undefined by default', function () {
        expect(testedRoute.bodySchema).to.be.undefined;
        expect(testedRoute.querySchema).to.be.undefined;
        expect(testedRoute.parametersSchema).to.be.undefined;
    });

    it('should return middleware and pre middleware undefined by default', function () {
        expect(testedRoute.middleware).to.be.undefined;
        expect(testedRoute.preMiddleware).to.be.undefined;
    });
});