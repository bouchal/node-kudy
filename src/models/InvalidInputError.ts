import {ErrorObject} from "ajv";

export default class InvalidInputError {
    protected _sectionName: string;
    protected _errors: ErrorObject[] | null | undefined;
    protected _schema: object;

    constructor(sectionName: string, errors: ErrorObject[] | null | undefined, schema: object) {
        this._sectionName = sectionName;
        this._errors = errors;
        this._schema = schema;
    }

    get sectionName(): string {
        return this._sectionName;
    }

    get errors(): ErrorObject[] | null | undefined {
        return this._errors;
    }

    get schema(): object {
        return this._schema;
    }
}