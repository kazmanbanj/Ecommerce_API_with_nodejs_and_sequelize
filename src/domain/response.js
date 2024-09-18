class Response {
    constructor(statusCode, message, data, error) {
        this.timeStamp = new Date().toLocaleString();
        this.statusCode = statusCode;
        this.message = message;
        this.data = data ?? [];
        this.error = error ?? [];
    }
}

module.exports = Response;