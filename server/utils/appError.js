// extends built in Error class
// will use to create all errors

class AppError extends Error {
  constructor(message, statusCode) {
    super(message); //error only accepts message, sets this.message to message

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; //400 is fail, 500 is an error
    this.isOperational = true; //user errors

    Error.captureStackTrace(this, this.constructor); // prevent function call from error handler from appearing in stacktrace
  }
}

module.exports = AppError;
