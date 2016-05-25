function GateWayError(message) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'Bad gateway';
    this.message = message;
    this.status = 502;
}
module.exports = GateWayError;