const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const validator = require("validator")
const mongoose = require("mongoose")


const User = require('../models/User');
const Tenant = require('../models/Tenant');
const Role = require("../models/Role");
const Plan = require("../models/Plans")


const {generateToken} = require("../utils/tokenGenerator");
const { verifyToken } = require('../utils/verifyToken');
const{generateCompanyCode} = require("../utils/generateCompanyCode")
const {validateAddress} = require("../utils/Validators/addressValidator")





const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]{8,20}$/;
const saltRounds = 10;


const tenantAdminLogin = async (req,res,next) =>{

    try{

        const {email,password} = req.body;

        if(!email || email.trim() === ""){
            const error = new Error("email and password is required");
            error.statusCode = 400;
            return next(error)
        }
        if(!password || password.trim() === ""){
            const error = new Error("email and password is required");
            error.statusCode = 400;
            return next(error)

        }

        const user = await User.findOne({email})
        .populate("role","name")
        .select("+password")


        if(!user){
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            return next(error)
        }
        if(!user.isActive || user.isDeleted){
            const error = new Error("Account is unavailable");
            error.statusCode = 403;
            return next(error);
        }

        if(!user.role || !user.role.name){
            const error = new Error("User role not found");
            error.statusCode = 500;
            return next(error);
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
             const error = new Error("Invalid email or password");
            error.statusCode = 401;
            return next(error)
        }

    


        if (user.role.name.toLowerCase() !== "tenantadmin") {
            const error = new Error("Only Tenant Admin is allowed to access this feature");
            error.statusCode = 403;
            return next(error);
        }

        user.lastLogin = new Date();
        await user.save();

        const token = generateToken({
                userId : user._id,
                role : user.role.name,
                designation : user.designation,
                tokenVersion : user.tokenVersion
            },"1h")
        
        return res.status(200).json({
            success : true,
            message : "Successfully logged in",
            token,
            user : {
                id : user._id,
                firstName : user.firstName,
                lastName : user.lastName,
                role : user.role.name,
                email: user.email,
                designation : user.designation
            }

        }, )





    }
    catch(error){
         error.statusCode = error.statusCode || 500;
         return next(error)

    }

}

const tenantProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId)
            .populate("role", "name")
            .select("-password");

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }

        if (!user.role || !user.role.name) {
            const error = new Error("User role not found");
            error.statusCode = 500;
            return next(error);
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            user: {
                tenant : {
                    orgName : user.tenant.orgName
                },
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role.name,
                email: user.email,
                designation: user.designation
            }
        });

    } catch (error) {
        error.statusCode = error.statusCode || 500;
        return next(error);
    }
};


const verifyInvitation = async(req,res,next)=>{
    try{

        const {token} = req.query;

        const decodedToken = verifyToken(token)

        if(!decodedToken.purpose){
            const error = new Error("Invalid Token");
            error.statusCode = 401;
            return next(error)
        
        }

        if(decodedToken.purpose !== "tenant-onboarding"){
            const error = new Error("Invalid Invitation Token");
            error.statusCode = 401;
            return next(error)
        }


        return res.status(200).json({
            success : true,
            message : "Invitation verified Successfully",
            email : decodedToken.email
        })

        

    }
    catch(error){

        if (error.name === "TokenExpiredError") {
            error.statusCode = 401;
            error.message = "Invitation link has expired";
        }

        if (error.name === "JsonWebTokenError") {
            error.statusCode = 401;
            error.message = "Invalid invitation token";
        }

       error.statusCode = error.statusCode || 500;
       return next(error)


    }
}


const createTenant = async(req,res,next)=>{

    let session;
    try{

        
        const {token,
    // Organization
            orgName,phone,website,industry,address,selectedPlan,
    // Tenant Admin
            firstName,lastName,adminPhone,password} = req.body;


            if(!token){
                const error = new Error("Invitation token required");
                error.statusCode = 400;
                return next(error);
            }

            const decodedToken = verifyToken(token);

            if(decodedToken.purpose !== "tenant-onboarding"){
                const error = new Error("Invalid Invitation Token");
                error.statusCode = 400;
                return next(error)
            }
            if(!decodedToken.email){
                const error = new Error("Invalid invitation token");
                error.statusCode=401;
                return next(error);
            }

            //Orgnaisation Names Validation

            if(!orgName || orgName.trim()===""){
                const error = new Error("Organization name is required");
                error.statusCode = 400;
                return next(error)
            }

            const organizationName = orgName.trim();

             const existingTenant = await Tenant.findOne({orgName : organizationName})

            if(existingTenant){
                const error = new Error("Organization already registered");
                error.statusCode = 409;
                return next(error)
            }

            if(organizationName.length<3 || organizationName.length>100){
                const error = new Error("Organization name must be between 3 and 100 characters");
                error.statusCode = 400;
                return next(error);
            }


            //Mobile Phone Validations

            if(!phone || phone.trim() ==="" ){
                const error = new Error("Phone number is required");
                error.statusCode = 400;
                return next(error)
            }

            if(! validator.isMobilePhone(phone)){
                const error = new Error("Enter a valid Phone number");
                error.statusCode = 400;
                return next(error)
            }

            //adminPhone validations

            if(!adminPhone || adminPhone.trim() ==="" ){
                const error = new Error("Phone number is required");
                error.statusCode = 400;
                return next(error)
            }

            if(! validator.isMobilePhone(adminPhone)){
                const error = new Error("Enter a valid Phone number");
                error.statusCode = 400;
                return next(error)
            }

            //Website_Validation

            if(website && ! validator.isURL(website)){
                const error = new Error("Enter a valid Website URL");
                error.statusCode = 400;
                return next(error)
            }

            //industry validation
            if (!industry || industry.trim() === "") {
                const error = new Error("Industry is required");
                error.statusCode = 400;
                return next(error);
            }

            const companyIndustry = industry.trim();

            if (companyIndustry.length < 2 || companyIndustry.length > 50) {
                const error = new Error("Industry must be between 2 and 50 characters");
                error.statusCode = 400;
                return next(error);
            }

            const INDUSTRIES = ["IT","Healthcare","Education","Manufacturing","Retail","Finance",
                                "Banking","Construction","Real Estate","Logistics","Hospitality",
                                 "Telecommunications","Government","Agriculture","Others"];

            if (!INDUSTRIES.includes(companyIndustry)) {
                const error = new Error("Please select a valid industry");
                error.statusCode = 400;
                return next(error);
            }

            

            //FirstName validations
            if (!firstName || firstName.trim() === "") {
                const error = new Error("First name is required");
                error.statusCode = 400;
                return next(error);
            }

            if (firstName.trim().length < 2 || firstName.trim().length > 50) {
                const error = new Error("First name must be between 2 and 50 characters");
                error.statusCode = 400;
                return next(error);
            }

            //LastName Validations

            if (!lastName || lastName.trim() === "") {
                const error = new Error("Last name is required");
                error.statusCode = 400;
                return next(error);
            }

            if (lastName.trim().length < 2 || lastName.trim().length > 50) {
                const error = new Error("Last name must be between 2 and 50 characters");
                error.statusCode = 400;
                return next(error);
            }

            //password Validations and Hashing

            if (!password) {
                const error = new Error("Password is required");
                error.statusCode = 400;
                return next(error);
            }

            if (!passwordRegex.test(password)) {
                const error = new Error(
                    "Password must be 8-20 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character."
                );
                error.statusCode = 400;
                return next(error);
            }
            //Address validation

            const validatedAddress = validateAddress(address)

            //plan validations
            if (!selectedPlan) {
                const error = new Error("Please select a subscription plan");
                error.statusCode = 400;
                return next(error);
            }

            if (!mongoose.Types.ObjectId.isValid(selectedPlan)) {
                const error = new Error("Invalid subscription plan");
                error.statusCode = 400;
                return next(error);
            }

            const allowedPlans = decodedToken.plans.map(plan => String(plan._id));

            if (!allowedPlans.includes(String(selectedPlan))) {
                const error = new Error("Selected plan is not available in this invitation");
                error.statusCode = 400;
                return next(error);
            }


            const selectedPlanDoc = await Plan.findById(selectedPlan).lean();

            if (!selectedPlanDoc || !selectedPlanDoc.isActive || selectedPlanDoc.isDeleted) {
                const error = new Error("Invalid subscription plan");
                error.statusCode = 400;
                return next(error);
            }

           

            const hashedPassword = await bcrypt.hash(password,saltRounds);

            //compnany code generation

            const companyCode = await generateCompanyCode();


            //using session

            session = await mongoose.startSession();

            session.startTransaction();

            const existingUser = await User.findOne({email: decodedToken.email}).session(session);

            if(existingUser){
                const error = new Error("A user with this email already exists");
                error.statusCode = 409;
                // return next(error)
                throw error;
            }

             

          const [tenant] = await Tenant.create([{
                orgName : organizationName,
                companyCode,
                email : decodedToken.email,
                phone,
                website,
                subscription: {
                    plan: selectedPlanDoc._id,
                    status: "Pending"
                },
                industry : companyIndustry,
                address : validatedAddress,
                employeeLimit: selectedPlanDoc.employeeLimit

            }],{session})



            const tenantAdminRole = await Role.findOne({
                name: "TenantAdmin",
                isDeleted: false
            }).session(session);

            if (!tenantAdminRole) {
                const error = new Error("Tenant Admin role not found");
                error.statusCode = 404;
                throw error;
            }

           

            const [tenantAdmin] = await User.create(
            [{
                tenant: {
                    tenantId: tenant._id,
                    orgName: tenant.orgName,
                    email: tenant.email
                },

                firstName: firstName.trim(),

                lastName: lastName.trim(),

                email: decodedToken.email,

                password: hashedPassword,

                phone: adminPhone,

                role: tenantAdminRole._id,

                designation: "Tenant Administrator",

                department: null,

                joiningDate: new Date(),

                employmentType: "Full-Time",

                salary: 0,

                reportingTo: {
                    userId: null,
                    name: null,
                    role: null
                },

                createdBy: {
                    userId: null,
                    name: "System",
                    role: "System"
                },

                status: "Inactive",

                isActive: false,

                isDeleted: false
            }],
            { session }
        );


        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "Tenant onboarding completed successfully. Waiting for Enterprise Admin approval."
        });


    }
    catch(error){
        console.log(error);

       if (session?.inTransaction()) {
            await session.abortTransaction();
        }


        if (error.name === "TokenExpiredError") {
            error.statusCode = 401;
            error.message = "Invitation link has expired";
        }

        if (error.name === "JsonWebTokenError") {
            error.statusCode = 401;
            error.message = "Invalid invitation token";
        }

    error.statusCode = error.statusCode || 500;

    return next(error);

    }

    finally{
        if (session) {
            await session.endSession();
        }
    }

}

module.exports = {tenantAdminLogin,tenantProfile,verifyInvitation,createTenant}
