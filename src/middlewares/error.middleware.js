const handleZodError = (err) => {
    const errors = err.issues.map(error => {
        return {
            path: error.path.join('.'),
            message: error.message
        }
    })
    return {
        message: "Validation error",
        errors
    }
}

const errorHandler = (err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong' } = err;

    if (err.name === 'ZodError') {
        const validationErrors = handleZodError(err);
        return res.status(400).json({
            success: false,
            ...validationErrors
        });
    }

    if (err.isOperational) {
        return res.status(statusCode).json({
            success: false,
            message,
        });
    }

    console.error('[Global Error_Handler]:', err);

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
};

export default errorHandler;
