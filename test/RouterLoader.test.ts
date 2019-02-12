import * as express from 'express';
import {Server} from "http"
import RouterLoader from "../src/RouterLoader";
import RouteParams from "./RouteParams";
import axios from "axios";
import * as chai from 'chai';
import * as bodyParser from "body-parser";
import {EmptyResponse} from "../src/kudy";

const expect = chai.expect;

const TEST_SERVER_URL = 'http://127.0.0.1';
const TEST_SERVER_PORT = 9999;


axios.defaults.baseURL = TEST_SERVER_URL + ':' + TEST_SERVER_PORT;


describe('RouterLoader', function () {
    let server: Server;
    const routeParams = new RouteParams();
    let routerLoader: RouterLoader<typeof routeParams>;
    let ownErrorHandlerLoader: RouterLoader<typeof routeParams>;
    const app = express();

    app.use(bodyParser.json());


    before(function (done) {
        server = app.listen(TEST_SERVER_PORT, () => {
            done();
        })
    });

    after(function (done) {
        server.close(done);
    });

    it('should init RouterLoader instance', function () {
        routerLoader = new RouterLoader<RouteParams>(routeParams);
        ownErrorHandlerLoader = new RouterLoader<RouteParams>(routeParams, {
            errorCatchHandler: async (err) => {
                return new EmptyResponse(404);
            },
            invalidInputHandler: async (err)=> {
                return new EmptyResponse(400);
            }
        });
    });

    it('should load routes and append them to express server', async function () {
        await routerLoader.appendRoutesFromDir(app, __dirname + '/testRoutes');
        await ownErrorHandlerLoader.appendRoutesFromDir(app, __dirname + '/errorRoutes');
    });

    it('should load router decorator with right params', async function () {
        const res = await axios.get(routeParams.routerTestRoutePath);
        expect(res.status).to.be.equal(200);
    });

    it('should load router decorator in sub dir', async function () {
        const res = await axios.get('/v0/test');
        expect(res.status).to.be.equal(200);
    });

    it('should load route in dir without decorator', async function () {
        const res = await axios.get('/v0/without-decorator');
        expect(res.status).to.be.equal(200);
    });

    it('should ignore route in ignored file', async function () {
        const res = await axios.get('/v0/ignored-route', {
            validateStatus: status => status < 500
        });

        expect(res.status).to.be.equal(404);
    });

    it('should add one middleware in routes', async function() {
        const res = await axios.get('/one-middleware');

        expect(res.data.headers['x-middleware']).to.be.equal('OK');
        expect(res.data.headers['x-pre-middleware']).to.be.equal('OK');
    });

    it('should add array middleware in routes', async function() {
        const res = await axios.get('/array-middleware');

        expect(res.data.headers['x-middleware-1']).to.be.equal('OK');
        expect(res.data.headers['x-middleware-2']).to.be.equal('OK');
        expect(res.data.headers['x-pre-middleware-1']).to.be.equal('OK');
        expect(res.data.headers['x-pre-middleware-2']).to.be.equal('OK');
    });

    it('should correctly validate body schema', async function () {
        const res = await axios.post('/body-schema', { id: 1 }, {
            validateStatus: status => status < 500
        });
        expect(res.status).to.be.equal(200);


        const res2 = await axios.post('/body-schema', { id: "string" }, {
            validateStatus: status => status < 500
        });
        expect(res2.status).to.be.equal(422);


        const res3 = await axios.post('/body-schema', undefined, {
            validateStatus: status => status < 500
        });
        expect(res3.status).to.be.equal(422);
    });

    it('should correctly validate query schema', async function () {
        const res = await axios.get('/query-schema', {
            params: {
                id: 1
            },
            validateStatus: status => status < 500
        });
        expect(res.status).to.be.equal(200);


        const res2 = await axios.get('/query-schema', {
            params: {
                id: "string"
            },
            validateStatus: status => status < 500
        });
        expect(res2.status).to.be.equal(422);


        const res3 = await axios.get('/query-schema', {
            validateStatus: status => status < 500
        });
        expect(res3.status).to.be.equal(422);
    });

    it('should correctly validate params schema', async function () {
        const res = await axios.get('/parameters-schema/1', {
            validateStatus: status => status < 500
        });
        expect(res.status).to.be.equal(200);


        const res2 = await axios.get('/parameters-schema/string', {
            validateStatus: status => status < 500
        });
        expect(res2.status).to.be.equal(422);
    });

    it('should correctly use own error handler', async function () {
        const res = await axios.get('/throw-error', {
            validateStatus: status => status < 500
        });
        expect(res.status).to.be.equal(404);
    });

    it('should correctly use own validation handler', async function () {
        const res = await axios.get('/invalid-schema', {
            validateStatus: status => status < 500
        });
        expect(res.status).to.be.equal(400);
    });
});