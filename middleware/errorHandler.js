const CustomError = require("../errors/CustomError");

const errorHandler = (err, req, res, next) => {
  let customError = {
    // Set default values
    statusCode: err.statusCode || 500,
    message: err.message || "Something went wrong",
  };

  if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    customError.statusCode = 400;
  }

  if (err.name === "CastError") {
    customError.message = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({
    success: false,
    message: customError.message,
  });
};

module.exports = errorHandler;
