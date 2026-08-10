const errorHandler = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        status: false,
        message: err.message || "Internal Server Error",
    });
};

export default errorHandler;