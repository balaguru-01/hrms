const jwt = require("jsonwebtoken");

const verifyToken = (token) =>{


     if(!token || token.trim()==="" ){
            const error = new Error("Token is Missing");
            error.statusCode = 400;
            throw error;
           
        }


    return jwt.verify(token,process.env.JWT_SECRET);
     

}

module.exports = {verifyToken}