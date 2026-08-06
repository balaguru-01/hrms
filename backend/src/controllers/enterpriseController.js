const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const User = require("../models/User");
const Plan = require("../models/Plans")
const Tenant = require("../models/Tenant");
const AuditLog = require("../models/AuditLog");
const Role = require("../models/Role");

const { sendTenantInvitationEmail, sendTenantApprovalEmail, sendTenantRejectionEmail } = require("../services/emailServices");
const {generateToken} = require('../utils/tokenGenerator');
const {subscriptionEndDateCalculator} = require("../utils/subscriptionEndDateCalculator");
const {escapeHtml} = require("../utils/escapeHtml");
const {calculateSubscriptionEndDate} = require("../utils/subscriptionEndDateCalculator")



const enterpriseAdminLogin = async (req,res,next)=>{

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

     if(!admin.role || !admin.role.name){
         const error = new Error("User role not found");
         error.statusCode = 500;
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
        designation : admin.designation,
        tokenVersion : admin.tokenVersion
    }, "1h")



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



const adminProfile = async (req,res,next) =>{
    try{
         const user = await User.findById(req.user.userId)
         .populate("role","name")
         .select("-password");

         if(!user){
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error)
         }
         if (!user.role || !user.role.name) {
            const error = new Error("User role not found");
            error.statusCode = 500;
            return next(error);
        }

         return res.status(200).json({
            success : true,
            message : "Profile fetched Successfully",
            user : {
            firstName : user.firstName,
            lastName : user.lastName,
            role : user.role.name,
            email :user.email,
            designation : user.designation

            }

         })


    }
    catch(error){
        error.statusCode = error.statusCode || 500;
        return next(error)



    }
}


const inviteTenant = async(req,res,next)=>{
    

    try{
        const {email} =  req.body;

        if (!email || email.trim() === "") {
            const error = new Error("Email is required");
            error.statusCode = 400;
            return next(error);
        }
        const normalizedEmail = email.trim().toLowerCase();

    
        if(! validator.isEmail(normalizedEmail)){
            const error = new Error("Invalid email address");
            error.statusCode = 400;
            return next(error);
        }
        
        
        const existingUser = await User.findOne({email : normalizedEmail})

        if(existingUser){
            const error = new Error("This email is already registered");
            error.statusCode = 409;
            return next(error)
        }

         const existingTenant = await Tenant.findOne({email: normalizedEmail});

        if (existingTenant) {
            const error = new Error("Tenant already exists");
            error.statusCode = 409;
            return next(error);
        }

        const plans = await Plan.find({isActive: true, isDeleted: false}).lean();

        if (!plans.length) {
            const error = new Error("No active plans available");
            error.statusCode = 404;
            return next(error);
        }

        

        const token = generateToken({
            email : normalizedEmail,
            purpose : "tenant-onboarding",
            plans: plans.map(plan => ({
                    _id: plan._id,
                    name: plan.name,
                    price: plan.price,
                    employeeLimit: plan.employeeLimit,
                    duration: plan.duration,
                    durationType: plan.durationType
                }))
        },
        "24h"
        )
        await sendTenantInvitationEmail(normalizedEmail, token);

        const loggedInUser = await User.findById(req.user.userId)
                             .populate("role", "name")
                             .select('-password');

        if (!loggedInUser) {
            const error = new Error("Logged in user not found");
            error.statusCode = 404;
            return next(error);
        }

        if(!loggedInUser.role || !loggedInUser.role.name){
            const error = new Error("User role not found");
            error.statusCode = 404;
            return next(error);

        }

        await AuditLog.create({
            tenant: {
                email : normalizedEmail
            },

           performedBy: {
                userId: loggedInUser._id,
                name: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
                role: loggedInUser.role.name
            },

            module: "Tenant",

            action: "Invite",

            reference: {
                module: "Tenant Invitation"
            },

            description: `Invitation email sent to ${normalizedEmail}`,

            ipAddress: req.ip,

            device: req.headers["user-agent"]
        });

            return res.status(200).json({
                success: true,
                message: "Invitation email sent successfully."
            });

            }

    catch(error){
        
         error.statusCode = error.statusCode || 500;
         return next(error)
                
     }
            



}


const getPendingApprovals = async(req,res,next)=>{
    try{

        console.log("✅ Entered getPendingApprovals");

        const pendingApprovals = await Tenant.find({"subscription.status" : "Pending" ,isDeleted : false})
        .populate("subscription.plan","name price employeeLimit duration durationType")
        .sort({ createdAt: -1 })
        .lean()

        if(!pendingApprovals.length){

           return res.status(200).json({
            success: true,
            count: 0,
            pendingApprovals: []
        }) 
        }

        return res.status(200).json({
            success: true,
            count: pendingApprovals.length,
            pendingApprovals: pendingApprovals.map((tenant) => ({
                _id: tenant._id,
                orgName: tenant.orgName,
                email: tenant.email,
                phone: tenant.phone,
                plan: tenant.subscription.plan? {
                    _id: tenant.subscription.plan._id,
                    name: tenant.subscription.plan.name,
                    price: tenant.subscription.plan.price,
                    employeeLimit: tenant.subscription.plan.employeeLimit,
                    duration: tenant.subscription.plan.duration,
                    durationType: tenant.subscription.plan.durationType
                }:null,
                subscriptionStatus: tenant.subscription.status
            }))
        });


    }
    catch(error){
        error.statusCode = error.statusCode || 500;
        return next(error) 
    }
}


const viewPendingTenant = async(req,res,next)=>{

    try{

        const {tenantId} = req.params;

        if(!tenantId){
            const error = new Error("Pending Tenant Id is required");
            error.statusCode = 400;
            return next(error)
        }
        if(! mongoose.Types.ObjectId.isValid(tenantId) ){
            const error = new Error("Invalid tenant id");
            error.statusCode = 400;
            return next(error);
        }

        const pendingTenant = await Tenant.findOne({_id: tenantId,"subscription.status": "Pending",isDeleted: false})
        .populate("subscription.plan","name price employeeLimit duration durationType")
        .lean()

        if(!pendingTenant){
            const error = new Error("Tenant not found");
            error.statusCode = 404;
            return next(error);
        }



        return res.status(200).json({
            success : true,
            tenant : {
                _id: pendingTenant._id,
                orgName: pendingTenant.orgName,
                email: pendingTenant.email,
                phone: pendingTenant.phone,
                website: pendingTenant.website,
                industry: pendingTenant.industry,
                address: pendingTenant.address,
                subscription: {
                        status: pendingTenant.subscription.status,
                        plan: pendingTenant.subscription.plan
                    }

            }

        })


    }
    catch(error){
        error.statusCode = error.statusCode || 500;
        return next(error)
    }

}

const approvePendingTenant = async (req,res,next)=>{

    const session = await mongoose.startSession();

    try{
        const {tenantId} = req.params;

        if(!tenantId){
            const error = new Error("Pending Tenant Id is required");
            error.statusCode = 400;
            return next(error)
        }
        if(! mongoose.Types.ObjectId.isValid(tenantId) ){
            const error = new Error("Invalid tenant id");
            error.statusCode = 400;
            return next(error);
        }

        session.startTransaction();

        const pendingTenant = await Tenant.findOne({_id: tenantId,"subscription.status": "Pending",isDeleted: false})
        .session(session)
                           
        
        if(!pendingTenant){
            const error = new Error("Pending Tenant not found");
            error.statusCode = 404;
            throw error;
        }
        //Fetch admin

        const epAdmin = await User.findById(req.user.userId)
        .session(session)
        .populate("role", "name")
        .lean()

        if(!epAdmin){
            const error = new Error("Enterprise Admin not found");
            error.statusCode = 404;
            throw error;
        }

        // Fetch subscription plan
        const plan = await Plan.findById(pendingTenant.subscription.plan)
        .session(session)

        if (!plan) {
            const error = new Error("Subscription plan not found");
            error.statusCode = 404;
            throw error;
        }


    //DB operations to activate tenant Organisation

       // Activate Tenant
        pendingTenant.subscription.status = "Active";
        pendingTenant.isActive = true;

        // Set subscription dates
        const startDate = new Date();

        pendingTenant.subscription.startDate = startDate;

        pendingTenant.subscription.endDate = calculateSubscriptionEndDate(
            startDate,
            plan.duration,
            plan.durationType
        );

       pendingTenant.createdBy = {
            userId: epAdmin._id,
            name: `${epAdmin.firstName} ${epAdmin.lastName}`,
            role: epAdmin.role.name
        };

    // Save changes
        await pendingTenant.save({ session });


// Activating Tenant Admin

        const tenantAdminRole = await Role.findOne({
            name: "TenantAdmin",
            isDeleted: false
        }).session(session);

        if (!tenantAdminRole) {
            const error = new Error("Tenant Admin role not found");
            error.statusCode = 404;
            throw error;
        }

        console.log("Pending Tenant ID:", pendingTenant._id.toString());
        console.log("Tenant Admin Role ID:", tenantAdminRole._id.toString());

        const pendingAdmin = await User.findOne({
            "tenant.tenantId": pendingTenant._id,
            role: tenantAdminRole._id,
            isDeleted: false,
            status: "Inactive",
            isActive: false
        })
        .session(session);

        if (!pendingAdmin) {
            const error = new Error("Tenant Admin not found");
            error.statusCode = 404;
            throw error;
        }

        //Activation DB Process

        pendingAdmin.status = "Active";
        pendingAdmin.isActive = true;

        pendingAdmin.createdBy = {
            userId: epAdmin._id,
            name: `${epAdmin.firstName} ${epAdmin.lastName}`,
            role: epAdmin.role.name
        };

        await pendingAdmin.save({ session });

        //Audit logs

        await AuditLog.create([{

            tenant : {
                tenantId: pendingTenant._id,
                orgName : pendingTenant.orgName,
                email : pendingTenant.email
            },
            performedBy:{
                userId : epAdmin._id,
                name: `${epAdmin.firstName} ${epAdmin.lastName}`,
                role: epAdmin.role.name
            },
            module : "Tenant",
            action : "Approve",
            reference :{
                module : "Tenant",
                referenceId : pendingTenant._id
            },
            description: `Approved tenant '${pendingTenant.orgName}' and activated the Tenant Admin account.`,

            ipAddress: req.ip,

            device: req.headers["user-agent"]

        }],{session})

        // Commit all database changes
        await session.commitTransaction();

        try{
            //Approval email
            await sendTenantApprovalEmail(
            pendingAdmin.email,
            pendingTenant.orgName
        );
            
        }
        catch(emailError){

            console.error("Failed to send tenant approval email:", emailError);

        }
        

        return res.status(200).json({
            success: true,
            message: "Tenant Approved Successfully."
        });






    }
    catch (error) {

        // Roll back transaction if it is still active
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        error.statusCode = error.statusCode || 500;
        return next(error);

    }
    finally {

        // Releasing the session
        await session.endSession();

    }
}

const rejectPendingTenant = async(req,res,next)=>{
    const session = await mongoose.startSession();

    try{
        const {tenantId} = req.params;
        const {rejectionReason} = req.body;

        if(!tenantId){
            const error = new Error("Pending Tenant Id is required");
            error.statusCode = 400;
            return next(error)
        }
        if(! mongoose.Types.ObjectId.isValid(tenantId) ){
            const error = new Error("Invalid tenant id");
            error.statusCode = 400;
            return next(error);
        }

        //Rejection message Validation
        if (!rejectionReason || rejectionReason.trim() === "") {
            const error = new Error("Rejection reason is required");
            error.statusCode = 400;
            return next(error);
        }
        if (rejectionReason.trim().length > 500) {
            const error = new Error("Rejection reason cannot exceed 500 characters");
            error.statusCode = 400;
            return next(error);
        }

        session.startTransaction();
        const pendingTenant = await Tenant.findOne({_id: tenantId,
                                                    "subscription.status": "Pending",
                                                    isDeleted: false})
        .session(session)

                           
        
        if(!pendingTenant){
            const error = new Error("Pending Tenant not found");
            error.statusCode = 404;
            throw error;
        }

        const epAdmin = await User.findById(req.user.userId)
        .session(session)
        .populate("role", "name")
        .lean()

        if(!epAdmin){
            const error = new Error("Enterprise Admin not found");
            error.statusCode = 404;
            throw error;
        }

        //DB operations for tenant

        pendingTenant.subscription.status = "Rejected";
        pendingTenant.subscription.rejectedReason =rejectionReason.trim();
        pendingTenant.isActive = false;

        pendingTenant.createdBy = {
            userId: epAdmin._id,
            name: `${epAdmin.firstName} ${epAdmin.lastName}`,
            role: epAdmin.role.name
        };

        await pendingTenant.save({ session });

        //Audit log
        await AuditLog.create([{

            tenant : {
                tenantId: pendingTenant._id,
                orgName : pendingTenant.orgName,
                email : pendingTenant.email
            },
            performedBy:{
                userId : epAdmin._id,
                name: `${epAdmin.firstName} ${epAdmin.lastName}`,
                role: epAdmin.role.name
            },
            module : "Tenant",
            action : "Reject",
            reference :{
                module : "Tenant",
                referenceId : pendingTenant._id
            },
            description: `Rejected tenant '${pendingTenant.orgName}'. Reason: ${rejectionReason.trim()}`,

            ipAddress: req.ip,

            device: req.headers["user-agent"]

        }],{session})

         // Commit all database changes
        await session.commitTransaction();

        const safeReason = escapeHtml(rejectionReason);

        try {

                await sendTenantRejectionEmail(
                    pendingTenant.email,
                    pendingTenant.orgName,
                    safeReason
                );

            }
        catch (emailError) {

                console.error("Failed to send tenant rejection email:", emailError);

        }


        return res.status(200).json({
            success: true,
            message: "Tenant Rejected Successfully."
        });



    }
    catch(error){

        // Roll back transaction if it is still active
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        error.statusCode = error.statusCode || 500;
        return next(error);

    }
    finally {

        // Releasing the session
        await session.endSession();

    }

}

module.exports = {enterpriseAdminLogin, 
                  adminProfile,
                  inviteTenant,
                  getPendingApprovals,
                  viewPendingTenant,
                  approvePendingTenant,
                  rejectPendingTenant
                }