function NotFoundError(message) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = "NotFoundError";
    this.message = message || "Not found";
    this.status = 404;
}
module.exports = NotFoundError;