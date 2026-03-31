const ErrorHandlerMiddleware = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log the full error in development/console
    console.error(err);

    // Joi Validation Errors
    if (err.isJoi) {
        return res.status(422).json({
            success: false,
            message: err.details[0].message,
            errors: err.details
        });
    }

    // MongoDB CastError (Invalid ObjectId)
    if (err.name === 'CastError') {
        const message = "Invalid ID format";
        return res.status(400).json({
            success: false,
            message: message,
            errors: err.message
        });
    }

    // MongoDB Duplicate Key Error
    if (err.code === 11000) {
        const message = "Duplicate field value";
        return res.status(409).json({
            success: false,
            message: message,
            errors: err.keyValue
        });
    }

    // Custom AppErrors
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // Default Error
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error'
    });
};

module.exports = ErrorHandlerMiddleware;
