import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            const error = new Error("Invalid Token");
            error.statusCode = 401;
            return next(error);
        }

        if (!authHeader.startsWith("Bearer ")) {
            const error = new Error("Invalid Token");
            error.statusCode = 401;
            return next(error);
        }

        const token = authHeader.split(" ")[1];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;

        next();
    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            error.statusCode = 401;
        }

        error.statusCode = error.statusCode || 500;
        return next(error);
    }
};

export default authMiddleware;