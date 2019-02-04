import PlainResponse from "./PlainResponse";
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import {Response} from "express";
import {mockRes} from "sinon-express-mock";

const expect = chai.expect;
chai.use(sinonChai);

const TEST_CODE = 304;
const TEST_BODY = 'lorem ipsum dolor si amet';

describe('PlainResponse', function () {
    it('should be initialized with default code 200, default empty body and pass them to response', async function () {
        const response: PlainResponse = new PlainResponse();

        const fakeResponse: Response = mockRes();
        await response.sendToResponse(fakeResponse);

        expect(fakeResponse.status).to.have.been.calledWith(200);
        expect(fakeResponse.send).to.have.been.calledWith('');
    });

    it('should be initialized with custom data and pass them to response ', async function () {
        const response: PlainResponse = new PlainResponse(TEST_BODY, TEST_CODE);

        const fakeResponse: Response = mockRes();
        await response.sendToResponse(fakeResponse);

        expect(fakeResponse.status).to.have.been.calledWith(TEST_CODE);
        expect(fakeResponse.send).to.have.been.calledWith(TEST_BODY);
    });
});