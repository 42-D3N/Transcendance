export class CustomError extends Error {
    // message!: string;
    status;
    constructor(message, statusCode) {
        super(message);
        this.status = statusCode;
    }
}
//# sourceMappingURL=custom-error.js.map