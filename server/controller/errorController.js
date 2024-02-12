const { MulterError } = require("multer");
const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleMulterError = (err) => {
  const message = err.message;

  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("Error", err);

    // 2) Send generic message

    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  // Express knows error middleware because of 4 parameters set
  err.statusCode = err.statusCode || 500; // read status code on object
  // if not defined '500' default
  err.status = err.status || "error";

  currentMode = process.env.NODE_ENV; //NODE_ENV resulting string seems to have spaces before or after so using 'includes' instead of === ... Will fix at a later date

  if (currentMode.includes("development")) {
    sendErrorDev(err, res);
  } else if (currentMode.includes("production")) {
    let error;
    if (err.name === "MulterError") {
      error = { ...err };
      error = handleMulterError(error);
    }
    if (err.name === "CastError") {
      error = { ...err };
      error = handleCastErrorDB(error);
    }

    error = { ...err };

    sendErrorProd(error, res);
  }
};
