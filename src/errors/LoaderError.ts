export default class LoaderError extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, LoaderError.prototype);
    }
}