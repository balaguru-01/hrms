const roleMiddleware = (...allowedRoles) =>{
    return (req,res,next)=>{
       try{

        if(!req.user || !req.user.role){
            const error = new Error("Not able to identify your role");
            error.statusCode = 401;
            return next(error)
        }

        const normalizedRoles = allowedRoles.map(role => role.toLowerCase());


         if(!normalizedRoles.includes(req.user.role.toLowerCase())){
            const error = new Error(`Sorry, ${req.user.role} cannot access this feature`);
            error.statusCode = 403;
            return next(error);
         }
         
         next();


       }
       catch(error){
        error.statusCode = error.statusCode || 500;
        return next(error)
       }
    }
}

module.exports = {roleMiddleware}