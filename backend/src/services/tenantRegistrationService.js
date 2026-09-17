import mongoose from "mongoose";

import bcrypt from "bcrypt";

import User from "../models/User.js";

import Role from "../models/Role.js";

import Tenant from "../models/Tenant.js";

import AuditLog from "../models/AuditLog.js";

import verifyToken from "../utils/tokenVerifier.js";

// ---------------------------------------
// VALIDATION
// ---------------------------------------

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneRegex = /^\d{10}$/;

const nameRegex = /^[A-Za-z]+$/;

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

// ---------------------------------------
// GENERATE COMPANY CODE
// ---------------------------------------

const generateCompanyCode = (organizationName) => {
  const organizationCode = organizationName
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6)
    .toUpperCase();

  const timeCode = Date.now()
    .toString()
    .slice(-4);

  return `${organizationCode}${timeCode}`;
};

// ---------------------------------------
// TENANT REGISTRATION SERVICE
// ---------------------------------------

const tenantRegistrationService = async ({
  token,
  firstName,
  lastName,
  phone,
  location,
  password,
}) => {

  // ---------------------------------------
  // 1. CHECK TOKEN
  // ---------------------------------------

  if (!token) {
    const error = new Error(
      "Invalid token."
    );

    error.statusCode = 400;

    error.auditReason =
      "Tenant registration token was not provided";

    throw error;
  }

  // ---------------------------------------
  // 2. VERIFY TOKEN
  // ---------------------------------------

  const tokenPayload =
    verifyToken(token);

  if (!tokenPayload) {
    const error = new Error(
      "Invalid token."
    );

    error.statusCode = 401;

    error.auditReason =
      "Tenant registration token could not be verified";

    throw error;
  }

  // ---------------------------------------
  // 3. CHECK TOKEN PURPOSE
  // ---------------------------------------

  if (
    tokenPayload.purpose !==
    "TenantInvitation"
  ) {
    const error = new Error(
      "Invalid token."
    );

    error.statusCode = 400;

    error.auditReason =
      "Invalid tenant invitation token purpose";

    throw error;
  }

  // ---------------------------------------
  // 4. GET TENANT INFORMATION FROM TOKEN
  // ---------------------------------------

  const invitedTenant =
    tokenPayload.tenant;

  if (
    !invitedTenant ||
    !invitedTenant.tenantId
  ) {
    const error = new Error(
      "Tenant information is missing from the invitation."
    );

    error.statusCode = 400;

    error.auditReason =
      "Tenant information missing from token";

    throw error;
  }

  // ---------------------------------------
  // 5. GET ORGANIZATION FROM TOKEN
  // ---------------------------------------

  const organizationName =
    tokenPayload.organizationName
      ?.trim()
      .toLowerCase();

  if (!organizationName) {
    const error = new Error(
      "Organization information is missing from the invitation."
    );

    error.statusCode = 400;

    error.auditReason =
      "Organization name missing from token";

    throw error;
  }

  // ---------------------------------------
  // 6. GET EMAIL FROM TOKEN
  // ---------------------------------------

  const email =
    tokenPayload.email
      ?.trim()
      .toLowerCase();

  if (!email) {
    const error = new Error(
      "Email information is missing from the invitation."
    );

    error.statusCode = 400;

    error.auditReason =
      "Email missing from token";

    throw error;
  }

  // ---------------------------------------
  // 7. VALIDATE ORGANIZATION NAME
  // ---------------------------------------

  if (!/^[a-z]+$/.test(organizationName)) {
    const error = new Error(
      "Invalid organization name."
    );

    error.statusCode = 400;

    error.auditReason =
      "Organization name must contain letters only";

    throw error;
  }

  // ---------------------------------------
  // 8. VALIDATE EMAIL
  // ---------------------------------------

  if (!emailRegex.test(email)) {
    const error = new Error(
      "Invalid email address."
    );

    error.statusCode = 400;

    error.auditReason =
      "Invalid email address";

    throw error;
  }

  // ---------------------------------------
  // 9. VALIDATE FIRST NAME
  // ---------------------------------------

  const normalizedFirstName =
    firstName?.trim();

  if (!normalizedFirstName) {
    const error = new Error(
      "First name is required."
    );

    error.statusCode = 400;

    error.auditReason =
      "First name was not provided";

    throw error;
  }

  if (!nameRegex.test(normalizedFirstName)) {
    const error = new Error(
      "First name should contain letters only."
    );

    error.statusCode = 400;

    error.auditReason =
      "Invalid first name";

    throw error;
  }

  // ---------------------------------------
  // 10. VALIDATE LAST NAME
  // ---------------------------------------

  const normalizedLastName =
    lastName?.trim();

  if (!normalizedLastName) {
    const error = new Error(
      "Last name is required."
    );

    error.statusCode = 400;

    error.auditReason =
      "Last name was not provided";

    throw error;
  }

  if (!nameRegex.test(normalizedLastName)) {
    const error = new Error(
      "Last name should contain letters only."
    );

    error.statusCode = 400;

    error.auditReason =
      "Invalid last name";

    throw error;
  }

  // ---------------------------------------
  // 11. VALIDATE PHONE
  // ---------------------------------------

  const normalizedPhone =
    phone?.trim();

  if (!phoneRegex.test(normalizedPhone)) {
    const error = new Error(
      "Phone number must contain exactly 10 digits."
    );

    error.statusCode = 400;

    error.auditReason =
      "Invalid phone number";

    throw error;
  }

  // ---------------------------------------
  // 12. VALIDATE LOCATION
  // ---------------------------------------

  const normalizedLocation =
    location?.trim();

  if (!normalizedLocation) {
    const error = new Error(
      "Location is required."
    );

    error.statusCode = 400;

    error.auditReason =
      "Location was not provided";

    throw error;
  }

  // ---------------------------------------
  // 13. VALIDATE PASSWORD
  // ---------------------------------------

  if (!password) {
    const error = new Error(
      "Password is required."
    );

    error.statusCode = 400;

    error.auditReason =
      "Password was not provided";

    throw error;
  }

  if (!passwordRegex.test(password)) {
    const error = new Error(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number."
    );

    error.statusCode = 400;

    error.auditReason =
      "Password does not meet required rules";

    throw error;
  }

  // ---------------------------------------
  // 14. GET INVITER ID FROM TOKEN
  // ---------------------------------------

  const invitedBy =
    tokenPayload.invitedBy;

  if (!invitedBy?.userId) {
    const error = new Error(
      "Invitation sender information is missing."
    );

    error.statusCode = 400;

    error.auditReason =
      "InvitedBy userId missing from token";

    throw error;
  }

  // ---------------------------------------
  // 15. FIND INVITER IN DATABASE
  // ---------------------------------------

  const inviter =
    await User.findOne({
      _id: invitedBy.userId,
      isDeleted: false,
    }).lean();

  if (!inviter) {
    const error = new Error(
      "Invitation sender was not found."
    );

    error.statusCode = 404;

    error.auditReason =
      "Inviting user was not found";

    throw error;
  }

  // ---------------------------------------
  // 16. BUILD INVITER NAME
  // ---------------------------------------

  const inviterName =
    `${inviter.firstName || ""} ${
      inviter.lastName || ""
    }`.trim();

  if (!inviterName) {
    const error = new Error(
      "Invitation sender name is missing."
    );

    error.statusCode = 400;

    error.auditReason =
      "Inviting user's name is missing";

    throw error;
  }

  // ---------------------------------------
  // 17. GET INVITER ROLE
  // ---------------------------------------

  const inviterRole =
    inviter.role?.name;

  if (!inviterRole) {
    const error = new Error(
      "Invitation sender role is missing."
    );

    error.statusCode = 400;

    error.auditReason =
      "Inviting user's role was not found";

    throw error;
  }

  // ---------------------------------------
  // 18. FIND EXISTING PENDING TENANT
  // ---------------------------------------

  const invitedTenantId =
    invitedTenant.tenantId;

  const pendingTenant =
    await Tenant.findOne({
      _id: invitedTenantId,

      orgName: organizationName,

      email,

      isDeleted: false,
    }).lean();

  if (!pendingTenant) {
    const error = new Error(
      "The invited tenant was not found."
    );

    error.statusCode = 404;

    error.auditReason =
      "Pending tenant from invitation was not found";

    throw error;
  }

  // ---------------------------------------
  // 19. CHECK TENANT STATUS
  // ---------------------------------------

  if (
    pendingTenant.subscription?.status !==
    "Pending"
  ) {
    const error = new Error(
      "This tenant invitation has already been processed."
    );

    error.statusCode = 409;

    error.auditReason =
      "Tenant invitation was already processed";

    throw error;
  }

  // ---------------------------------------
  // 20. CHECK DUPLICATE USER
  // ---------------------------------------

  const existingUser =
    await User.findOne({
      $or: [
        {
          email,
        },
        {
          phone:
            normalizedPhone,
        },
      ],

      isDeleted: false,
    }).lean();

  if (existingUser) {
    const error = new Error(
      "A user with this email or phone number already exists."
    );

    error.statusCode = 409;

    error.auditReason =
      "Duplicate user email or phone";

    throw error;
  }

  // ---------------------------------------
  // 21. FIND TENANT SUPER ADMIN ROLE
  // ---------------------------------------

  const tenantSuperAdminRole =
    await Role.findOne({
      name: "TenantSuperAdmin",

      isSystemRole: true,

      isActive: true,

      isDeleted: false,
    }).lean();

  if (!tenantSuperAdminRole) {
    const error = new Error(
      "Tenant administrator role was not found."
    );

    error.statusCode = 404;

    error.auditReason =
      "TenantSuperAdmin role not found";

    throw error;
  }

  // ---------------------------------------
  // 22. GENERATE COMPANY CODE
  // ---------------------------------------

  const companyCode =
    generateCompanyCode(
      organizationName
    );

  // ---------------------------------------
  // 23. HASH PASSWORD
  // ---------------------------------------

  const hashedPassword =
    await bcrypt.hash(
      password,
      10
    );

  // ---------------------------------------
  // 24. START MONGO TRANSACTION
  // ---------------------------------------

  const session =
    await mongoose.startSession();

  try {
    session.startTransaction();

    // ---------------------------------------
    // 25. UPDATE EXISTING PENDING TENANT
    // ---------------------------------------

    const tenantDocument =
      await Tenant.findOne({
        _id: invitedTenantId,

        orgName:
          organizationName,

        email,

        isDeleted: false,
      }).session(session);

    if (!tenantDocument) {
      const error = new Error(
        "The invited tenant was not found."
      );

      error.statusCode = 404;

      error.auditReason =
        "Pending tenant was not found during registration";

      throw error;
    }

    if (
      tenantDocument.subscription?.status !==
      "Pending"
    ) {
      const error = new Error(
        "This tenant invitation has already been processed."
      );

      error.statusCode = 409;

      error.auditReason =
        "Tenant invitation already processed";

      throw error;
    }

    tenantDocument.companyCode =
      companyCode;

    tenantDocument.phone =
      normalizedPhone;

    tenantDocument.industry =
      "IT";

    tenantDocument.employeeCount =
      tenantDocument.employeeCount ?? 0;

    tenantDocument.subscription = {
      ...(tenantDocument.subscription || {}),
      status: "Pending",
      employeeLimit:
        tenantDocument.subscription?.employeeLimit ??
        10,
    };

    tenantDocument.isActive =
      false;

    tenantDocument.isDeleted =
      false;

    tenantDocument.updatedBy = {
      userId: inviter._id,

      name: inviterName,

      role: inviterRole,
    };

    await tenantDocument.save({
      session,
    });

    const newTenant =
      tenantDocument;

    // ---------------------------------------
    // 26. CREATE TENANT SUPER ADMIN USER
    // ---------------------------------------

    const userDocuments =
      await User.create(
        [
          {
            tenant: {
              tenantId:
                newTenant._id,

              orgName:
                newTenant.orgName,

              email:
                newTenant.email,
            },

            firstName:
              normalizedFirstName,

            lastName:
              normalizedLastName,

            email,

            password:
              hashedPassword,

            phone:
              normalizedPhone,

            location:
              normalizedLocation,

            role: {
              roleId:
                tenantSuperAdminRole._id,

              name:
                tenantSuperAdminRole.name,
            },

            designation:
              "Tenant Super Administrator",

            status:
              "Pending",

            isActive:
              false,

            isDeleted:
              false,

            createdBy: {
              userId:
                inviter._id,

              name:
                inviterName,

              role:
                inviterRole,
            },

            updatedBy: {
              userId:
                null,

              name:
                null,

              role:
                null,
            },
          },
        ],
        {
          session,
        }
      );

    const newUser =
      userDocuments[0];

    // ---------------------------------------
    // 27. CREATE AUDIT LOG
    // ---------------------------------------

    await AuditLog.create(
      [
        {
          tenant: {
            tenantId:
              newTenant._id,

            orgName:
              newTenant.orgName,

            email:
              newTenant.email,
          },

          performedBy: {
            userId:
              inviter._id,

            name:
              inviterName,

            role:
              inviterRole,

            designation:
              inviter.designation ||
              null,
          },

          module:
            "Tenant",

          action:
            "Submit",

          relatedTo: {
            module:
              "Tenant",

            referenceId:
              newTenant._id,

            title:
              newTenant.orgName,
          },

          changes: {
            oldData:
              null,

            newData: {
              organizationName:
                newTenant.orgName,

              email:
                newTenant.email,

              companyCode:
                newTenant.companyCode,

              phone:
                newTenant.phone,

              employeeCount:
                newTenant.employeeCount,

              firstName:
                newUser.firstName,

              lastName:
                newUser.lastName,

              location:
                newUser.location,

              role:
                newUser.role.name,

              designation:
                newUser.designation,

              status:
                newUser.status,

              subscriptionStatus:
                newTenant.subscription.status,

              isActive:
                newTenant.isActive,

              userId:
                newUser._id,
            },
          },

          description:
            `Tenant registration submitted for ${newTenant.orgName}. Account is pending approval.`,

          status:
            "Success",

          isActive:
            true,

          isDeleted:
            false,
        },
      ],

      {
        session,
      }
    );

    // ---------------------------------------
    // 28. COMMIT TRANSACTION
    // ---------------------------------------

    await session.commitTransaction();

    // ---------------------------------------
    // 29. RETURN RESULT
    // ---------------------------------------

    return {
      tenantId:
        newTenant._id,

      organizationName:
        newTenant.orgName,

      email:
        newTenant.email,

      companyCode:
        newTenant.companyCode,

      userId:
        newUser._id,

      firstName:
        newUser.firstName,

      lastName:
        newUser.lastName,

      phone:
        newUser.phone,

      location:
        newUser.location,

      role:
        newUser.role,

      designation:
        newUser.designation,

      status:
        newUser.status,

      isActive:
        newUser.isActive,

      invitedBy: {
        userId:
          inviter._id,

        name:
          inviterName,

        role:
          inviterRole,
      },
    };

  } catch (error) {

    // ---------------------------------------
    // ROLLBACK
    // ---------------------------------------

    await session.abortTransaction();

    throw error;

  } finally {

    // ---------------------------------------
    // END SESSION
    // ---------------------------------------

    await session.endSession();
  }
};

export default tenantRegistrationService;