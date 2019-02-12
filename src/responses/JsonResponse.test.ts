import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import {Response} from "express";
import {mockRes} from "sinon-express-mock";
import JsonResponse from "./JsonResponse";

const expect = chai.expect;
chai.use(sinonChai);

const TEST_CODE = 304;
const TEST_JSON_BODY = {
    "lorem": "ipsum"
};

describe('JsonResponse', function () {

    it('should be initialized with default code 200, default empty body and pass them to response', async function () {
        const response: JsonResponse = new JsonResponse();

        const fakeResponse: Response = mockRes();
        await response.sendToResponse(fakeResponse);

        expect(fakeResponse.status).to.have.been.calledWith(200);
        expect(fakeResponse.json).to.have.been.calledWith({})
    });

    it('should be initialized with custom data and pass them to response ', async function () {
        const response: JsonResponse = new JsonResponse(TEST_JSON_BODY, TEST_CODE);

        const fakeResponse: Response = mockRes();
        await response.sendToResponse(fakeResponse);

        expect(fakeResponse.status).to.have.been.calledWith(TEST_CODE);
        expect(fakeResponse.json).to.have.been.calledWith(TEST_JSON_BODY)
    });
});