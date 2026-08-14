import jwt from "jsonwebtoken";

const verifyToken = (token) => {
    try
    {
        return jwt.verify(token, process.env.JWT_SECRET);
    } 
    catch (error) 
    {
        const err = new Error("Invalid or expired token");
        err.statusCode = 401;
        throw err;
    }
};

export default verifyToken;