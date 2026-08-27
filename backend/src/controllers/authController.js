  import  { loginService } from "../services/authServices.js";
 
 
 export const userLogin = async (req,res,next)=>{

  try{

    const{email,password} = req.body;
    
    const result = await loginService({
        email : email.toLowerCase().trim(),
        password : password.trim(),
        ipAddress: req.ip,
        userAgent: req.get("user-agent")
    })

        return res.status(200).json(result)

  }
  catch(error){
    error.statusCode = error.statusCode || 500;

     error.auditDetails = {
        module: "Authentication",
        action: "Login",
        reason: error.auditReason || error.message,
    };


    return next(error)
  }

} 