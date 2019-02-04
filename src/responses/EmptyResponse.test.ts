import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);

import {mockReq, mockRes} from "sinon-express-mock";

import EmptyResponse from "./EmptyResponse";
import {Response} from "express";

const TEST_CODE = 304;

describe('EmptyResponse', function () {
    it('should be initialized with default code 200', async function () {
        const response: EmptyResponse = new EmptyResponse();

        const fakeResponse: Response = mockRes();
        await response.sendToResponse(fakeResponse);

        expect(fakeResponse.sendStatus).to.have.been.calledWith(200);
    });

    it('should be initialized with custom data and pass them to response ', async function () {
        const response: EmptyResponse = new EmptyResponse(TEST_CODE);

        const fakeResponse: Response = mockRes();
        await response.sendToResponse(fakeResponse);

        expect(fakeResponse.sendStatus).to.have.been.calledWith(TEST_CODE);
    });
});