import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "../models/User.js";
import Role from "../models/Role.js";
import Tenant from "../models/Tenant.js";
import Notification from "../models/Notification.js";
import AuditLog from "../models/AuditLog.js";

import validateUserCreation from "../utils/inputValidations.js";
import verifyToken from "../utils/tokenVerifier.js";
import generateAvatarUrl from "../utils/avatarGenerator.js";

const userRegistrationService = async ({
    token,
    firstName,
    lastName,
    email,
    password,
    phone,
    location
}) => {

    //checking token exists

    if(!token){
        const error = new Error("Invalid token");
        error.auditReason = "Invitation Token not found";
        error.statusCode = 404;
        throw error;
    }

    
    //  Verifying invitation token
    
    const tokenPayload = verifyToken(token);

    if(!tokenPayload){
        const error = new Error("Invalid token");
        error.auditReason = "Token Payloads not found";
        error.statusCode = 404;
        throw error;
    }

    // Check token purpose
    if (tokenPayload.purpose !== "UserRegistration") {
        const error = new Error("Invalid token");
        error.auditReason = " Invalid Invitation Token";
        error.statusCode = 400;
        throw error;
    }


    
    // Validate submitted user details
    
    validateUserCreation({
        firstName,
        lastName,
        email,
        password,
        phone,
        location
    });

    
    //  Verify email against token
    
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== tokenPayload.email) {
        const error = new Error("Invalid data");
        error.auditReason = "Email does not match the invitation";
        error.statusCode = 400;
        throw error;
    }


    //  Get role from token

    if (!tokenPayload.role || !tokenPayload.role.roleId ||
        !tokenPayload.role.name || ! mongoose.Types.ObjectId.isValid(tokenPayload.role.roleId))
    {
        const error = new Error("Invalid data");
        error.auditReason = "Invalid role information in invitation"
        error.statusCode = 400;
        throw error;
    }


    const userRole = await Role.findOne({
        _id: tokenPayload.role.roleId,
        name: tokenPayload.role.name,
        isActive: true,
        isDeleted: false,
    }).lean();


    if (!userRole) {
        const error = new Error("Resource not found");
        error.auditReason = "The invited role is no longer available";
        error.statusCode = 404;
        throw error;
    }

    // Validate the designation from invitation

    if(! tokenPayload.designation || tokenPayload.designation.trim() === ""){
        const error = new Error("Invalid data");
        error.auditReason = "Invalid designation"
        error.statusCode = 400;
        throw error;
    }


    const normalizedDesignation = tokenPayload.designation.trim();

    // Validate inviter information from token

    if (
        !tokenPayload.invitedBy || !tokenPayload.invitedBy.userId ||
        !tokenPayload.invitedBy.name || !tokenPayload.invitedBy.role ||
        !mongoose.Types.ObjectId.isValid(tokenPayload.invitedBy.userId)
    ) {
        const error = new Error("Invalid data");
        error.auditReason = "Invalid inviter information in invitation";
        error.statusCode = 400;
        throw error;
    }

    const inviter = await User.findOne({
        _id : tokenPayload.invitedBy.userId,
        isActive : true,
        isDeleted : false,
    })

     if (!inviter) {
            const error = new Error("Resource not found");
            error.auditReason = "Unable to find the inviter";
            error.statusCode = 404;
            throw error;
        }



    //  Get tenant informations from token
    

    let userTenant = null;

    if (tokenPayload.tenant) {

        if (!tokenPayload.tenant.tenantId) {
            const error = new Error("Invalid data");
            error.auditReason = "Invalid tenant information in invitation";
            error.statusCode = 400;
            throw error;
        }


        const tenant = await Tenant.findOne({
            _id: tokenPayload.tenant.tenantId,
            isDeleted: false,
            isActive: true,
        }).lean();


        if (!tenant) {
            const error = new Error("Resource not found");
            error.auditReason = "Tenant not found";
            error.statusCode = 404;
            throw error;
        }


        userTenant = {
            tenantId: tenant._id,
            orgName: tenant.orgName,
            email: tenant.email,
        };
    }

    // Check duplicate email

    const existingEmail = await User.findOne({
        email: normalizedEmail,
        isDeleted: false
    });


    if (existingEmail) {
        const error = new Error("Invalid data");
        error.auditReason = "User already exists";
        error.statusCode = 409;
        throw error;
    }

    
    // Check duplicate phone

    const existingPhone = await User.findOne({
        phone : phone.trim(),
        isDeleted: false
    });


    if (existingPhone) {
        const error = new Error("Invalid data");
        error.auditReason = "Phone number already exists";
        error.statusCode = 409;
        throw error;
    }

    //Avatar Generator
    const avatarUrl = generateAvatarUrl(firstName,lastName);

    if(!avatarUrl || avatarUrl.trim()=== "" ){
        const error = new Error("Invalid data");
        error.auditReason = "Not able to create avatar";
        error.statusCode = 400;
        throw error;
    }


    // Hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    //  Start transaction
    
    const session = await mongoose.startSession();


    try {

        session.startTransaction();
    
        // Creating user
        
        const [newUser] = await User.create(
            [
                {
                    tenant: userTenant,

                    firstName: firstName.trim(),

                    lastName: lastName.trim(),

                    email: normalizedEmail,

                    password: hashedPassword,

                    phone: phone.trim(),

                    location: location?.trim() || null,

                    profilePicture : avatarUrl.trim(),

                    role: {
                        roleId: userRole._id,
                        name: userRole.name,
                    },

                    designation: normalizedDesignation,

                    status: "Pending",

                    isActive: false,

                    isDeleted: false,

                    // User was created automatically by the system
                    // after invitation registration.
                    createdBy: {
                        userId: null,
                        name: "System",
                        role: "System",
                    },

                    updatedBy: {
                        userId: null,
                        name: null,
                        role: null,
                    },
                },
            ],
            { session }
        );


    
        //  Create audit log
        
        await AuditLog.create(
            [
                {
                    tenant: userTenant,

                    performedBy: {
                        userId: null,
                        name: "System",
                        role: "System",
                        designation: null,
                    },

                    module: "User",

                    action: "Submit",

                    relatedTo: {
                        module: "User",
                        referenceId: newUser._id,
                        title: `${newUser.firstName} ${newUser.lastName}`,
                    },

                    changes: {
                        oldData: null,

                        newData: {
                            firstName: newUser.firstName,
                            lastName: newUser.lastName,
                            email: newUser.email,
                            phone: newUser.phone,
                            role: newUser.role.name,
                            location: newUser.location,
                            designation: newUser.designation,
                            profilePicture: newUser.profilePicture,
                            status: newUser.status,
                            isActive: newUser.isActive,
                        },
                    },

                    description:
                        `User registration submitted for ${newUser.role.name}. Account is pending approval.`,

                    status: "Success",

                    isActive: true,

                    isDeleted: false,
                },
            ],
            { session }
        );

        // Create notification for inviter

        await Notification.create(
            [
                {
                    tenant: userTenant,

                    sender: {
                        userId: null,
                        name: "System",
                        role: "System",
                        designation: null,
                    },

                    recipient: {
                        userId: inviter._id,
                        name: `${inviter.firstName} ${inviter.lastName}`,
                        role: inviter.role.name,
                        designation: inviter.designation || null,
                    },

                    title: "New User Registration",

                    message:
                        `${newUser.firstName} ${newUser.lastName} has submitted a registration request and is waiting for your approval.`,

                    notificationType: "User",

                    relatedTo: {
                        module: "User",
                        referenceId: newUser._id,
                        title: `${newUser.firstName} ${newUser.lastName}`,
                    },

                    isRead: false,

                    isActive: true,
                    isDeleted: false,
                },
            ],
            { session }
        );


        
        // Commit transaction
        
        await session.commitTransaction();


        return {
            userId: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            tenant: newUser.tenant,
            status: newUser.status,
            isActive: newUser.isActive,
            invitedBy: tokenPayload.invitedBy,
        };

    } 
    catch (error) {

        // Rollback transaction
        await session.abortTransaction();
        throw error;

    } 

    finally {

        // End session
        await session.endSession();
    }
};


export default userRegistrationService;