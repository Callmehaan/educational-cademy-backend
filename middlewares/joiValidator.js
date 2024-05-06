const validateWithJoi = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.body);

            return next();
        } catch (err) {
            if (err.isJoi) {
                const errorObj = {};
                const errorDetails = err.details[0];

                errorObj[errorDetails.context.key] =
                    errorDetails.message.replace(/"/g, "");

                console.log("Joi Validator -> ", errorObj);

                return res.status(400).json(errorObj);
            }

            return res.status(500).json({ message: err.message });
        }
    };
};

module.exports = validateWithJoi;
