/**
 * Response handler middleware to add success() method to response object
 * Provides consistent response format across all controllers
 */
const responseHandlerMiddleware = (req, res, next) => {
    // Add success method to response object
    res.success = (data = null, statusCode = 200) => {
        const response = {
            success: true,
            message: data?.message || 'Operation successful',
            data: data?.data || data
        };
        
        return res.status(statusCode).json(response);
    };
    
    // Add error method to response object
    res.error = (message, statusCode = 400, data = null) => {
        const response = {
            success: false,
            message: message,
            data: data
        };
        
        return res.status(statusCode).json(response);
    };
    
    next();
};

module.exports = responseHandlerMiddleware;
