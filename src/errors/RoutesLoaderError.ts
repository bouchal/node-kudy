export default class RoutesLoaderError extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, RoutesLoaderError.prototype);
    }
}