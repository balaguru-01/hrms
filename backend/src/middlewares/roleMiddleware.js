const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user || !req.user.role) {
                const error = new Error("Unauthorized Access");
                error.statusCode = 401;
                return next(error);
            }

            const normalizedRoles = allowedRoles.map((role) =>
                role.toLowerCase()
            );

            if (!normalizedRoles.includes(req.user.role.toLowerCase())) {
                const error = new Error(
                    `Unauthorized Access`
                );
                error.statusCode = 403;
                return next(error);
            }
            
            next();
        } catch (error) {
            error.statusCode = error.statusCode || 500;
            return next(error);
        }
    };
};

export default roleMiddleware;