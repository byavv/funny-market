function APIError(message) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'Server error';
    this.message = message;
    this.status = 500;
}
module.exports = APIError;