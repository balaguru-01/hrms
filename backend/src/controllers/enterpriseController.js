const User = require('../models/User')
const bcrypt = require("bcrypt")
const generateToken = require('../utils/tokenGenerator')


const enterpriseAdminLogin = async (req,res,next)=>{

  try{

    const {email,password} = req.body;

    if(!email || email.trim() === ""){
        const error = new Error("email is required");
        error.statusCode = 400;
        return next(error)
    }

    if(!password || password.trim() === ""){
        const error = new Error("passsword is required");
        error.statusCode = 400;
        return next(error)
    }
    

    const admin = await User.findOne({email})
            .populate("role","name")
            .select("+password")

    if(!admin){
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        return next(error)

    }

     if(!admin.isActive || admin.isDeleted){
        const error = new Error("Account is unavailable");
        error.statusCode = 403;
        return next(error);
    }

    const isMatch = await bcrypt.compare(password,admin.password);

    if(!isMatch){
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        return next(error)
    }

    if(admin.role.name.toLowerCase() !== "enterpriseadmin"){
        const error = new Error("Only Enterprise Admin is allowed to access this feature");
        error.statusCode = 403;
        return next(error)

    }
   

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken({
        userId : admin._id,
        role : admin.role.name,
        email :admin.email,
        designation : admin.designation
    })



    return res.status(200).json({
        success : true,
        message : "Successfully logged in",
        token,
        user : {
            id : admin._id,
            firstName : admin.firstName,
            lastName : admin.lastName,
            role : admin.role.name,
            email :admin.email,
            designation : admin.designation

        }
    })



  }
  catch(error){
    error.statusCode = error.statusCode || 500;
    return next(error)
  }

} 
module.exports = {enterpriseAdminLogin}