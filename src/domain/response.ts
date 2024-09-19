class Response<T> {
    timeStamp: string;
    statusCode: number;
    message: string;
    data: Record<string, any>;
    error: Record<string, any>;

    constructor(statusCode: number, message: string, data?: Record<string, any>, error?: Record<string, any>) {
        this.timeStamp = new Date().toLocaleString();
        this.statusCode = statusCode;
        this.message = message;
        this.data = data ?? [];
        this.error = error ?? [];
    }
}

export default Response;