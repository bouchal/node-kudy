import {ErrorObject} from "ajv";

export default class InvalidInputError {
    public sectionName: string;
    public errors: ErrorObject[] | null | undefined;
    public schema: object;

    constructor(sectionName: string, errors: ErrorObject[] | null | undefined, schema: object) {
        this.sectionName = sectionName;
        this.errors = errors;
        this.schema = schema;
    }
}