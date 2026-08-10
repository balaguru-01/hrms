import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/tokenGenerator.js";

export const loginService = async ({ email, password,  ipAddress, userAgent }) => {

   if(!email || email.trim() === "" ||!password || password.trim() === ""){
        const error = new Error("Invalid email or password");
        error.statusCode = 400;
        throw error;
    }



    const user = await User.findOne({email})
            .select("+password")

    if(!user){    
        await bcrypt.compare("Dup_value3",process.env.DUMMY_HASHED_PASSWORD);
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    if (!user.isActive || user.isDeleted) {
        await bcrypt.compare("Dup_value3",process.env.DUMMY_HASHED_PASSWORD);
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }


    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }
   

    user.lastLogin = new Date();
    await user.save();

    await AuditLog.create({
        tenant: {
            tenantId: user.tenant?.tenantId || null,
            orgName: user.tenant?.orgName || null,
            email: user.tenant?.email || null,
        },

        performedBy: {
            userId: user._id,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role.name,
            designation: user.designation,
        },

        module: "Authentication",

        action: "Login",

        relatedTo: {
            module: "User",
            referenceId: user._id,
            title: `${user.firstName} ${user.lastName}`,
        },

        description: "User logged in successfully",

        ipAddress,

        userAgent,

        status: "Success",

        isActive: true,

        isDeleted: false,
    });

    const token = generateToken({
        userId : user._id,
        role : user.role.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email : user.email,
        designation : user.designation,
        tokenVersion : user.tokenVersion
    }, "1h")

    return {
        success : true,
        message : `Welcome back ${user.firstName} ${user.lastName}.`,
        token
        
    };
};