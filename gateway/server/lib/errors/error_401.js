function UnauthorizedAccessError(message) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = "UnauthorizedAccessError";
    this.message = message;
    this.status = 401;
}
module.exports = UnauthorizedAccessError;
