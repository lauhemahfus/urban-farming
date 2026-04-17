const validate = (schema) => (req, res, next) => {
    try {
        const parsed = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        req.body = parsed.body;

        next();
    } catch (error) {
        console.error('Validation error:', error.errors || error.message); 

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: error.errors || error.message
        });
    }
};

export default validate;