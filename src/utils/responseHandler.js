const responseHandler = {
    success: (res, data, message, statusCode = 200) => {
        return res.status(statusCode).json({
            status: 'OK',
            data: data,
            message: message
        });
    },
    
    error: (res, message, statusCode = 500) => {
        return res.status(statusCode).json({
            status: 'ERROR',
            data: null,
            message: message
        });
    }
};

module.exports = responseHandler;