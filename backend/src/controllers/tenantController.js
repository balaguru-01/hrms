import mongoose from "mongoose";

import Tenant from "../models/Tenant.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";

// ---------------------------------------
// GET ALL TENANTS
// ---------------------------------------

export const getTenants = async (req, res, next) => {
  try {
    const tenants = await Tenant.find({
      isDeleted: false,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Tenants fetched successfully.",
      data: tenants,
    });
  } catch (error) {
    error.auditDetails = {
      module: "Tenant",
      action: "Fetch",
      reason:
        error.auditReason ||
        error.message,
    };

    next(error);
  }
};

// ---------------------------------------
// GET SINGLE TENANT
// ---------------------------------------

export const getTenantById = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      const error = new Error(
        "Invalid tenant ID."
      );

      error.statusCode = 400;
      error.auditReason =
        "Invalid tenant ID";

      throw error;
    }

    const tenant =
      await Tenant.findOne({
        _id: id,
        isDeleted: false,
      }).lean();

    if (!tenant) {
      const error = new Error(
        "Tenant not found."
      );

      error.statusCode = 404;
      error.auditReason =
        "Tenant was not found";

      throw error;
    }

    return res.status(200).json({
      success: true,
      message: "Tenant fetched successfully.",
      data: tenant,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------
// UPDATE TENANT
// ---------------------------------------

export const updateTenant = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      const error = new Error(
        "Invalid tenant ID."
      );

      error.statusCode = 400;
      error.auditReason =
        "Invalid tenant ID";

      throw error;
    }

    // -------------------------------
    // Find tenant
    // -------------------------------

    const tenant =
      await Tenant.findOne({
        _id: id,
        isDeleted: false,
      });

    if (!tenant) {
      const error = new Error(
        "Tenant not found."
      );

      error.statusCode = 404;
      error.auditReason =
        "Tenant was not found";

      throw error;
    }

    // -------------------------------
    // Allowed fields
    // -------------------------------

    const allowedFields = [
      "orgName",
      "email",
      "phone",
      "website",
      "logo",
      "industry",
      "address",
      "subscription",
    ];

    const oldData = {
      orgName: tenant.orgName,
      email: tenant.email,
      phone: tenant.phone,
      website: tenant.website,
      logo: tenant.logo,
      industry: tenant.industry,
      address: tenant.address,
      subscription:
        tenant.subscription,
    };

    // -------------------------------
    // Update only allowed fields
    // -------------------------------

    allowedFields.forEach((field) => {
      if (
        req.body[field] !== undefined
      ) {
        tenant[field] =
          req.body[field];
      }
    });

    // -------------------------------
    // Updated By
    // -------------------------------

    const updatedByUser =
      await User.findOne({
        _id: req.user.userId,
        isDeleted: false,
      }).lean();

    tenant.updatedBy = {
      userId: req.user.userId,
      name: updatedByUser
        ? `${updatedByUser.firstName || ""} ${
            updatedByUser.lastName || ""
          }`.trim()
        : "",
      role:
        updatedByUser?.role?.name ||
        req.user.role ||
        "",
    };

    await tenant.save();

    // -------------------------------
    // Audit Log
    // -------------------------------

    try {
      await AuditLog.create({
        tenant: {
          tenantId: tenant._id,
          orgName: tenant.orgName,
          email: tenant.email,
        },

        performedBy: {
          userId:
            req.user.userId,

          name:
            tenant.updatedBy.name,

          role:
            tenant.updatedBy.role,

          designation:
            updatedByUser?.designation ||
            null,
        },

        module: "Tenant",

        action: "Update",

        relatedTo: {
          module: "Tenant",
          referenceId: tenant._id,
          title: tenant.orgName,
        },

        changes: {
          oldData,
          newData: {
            orgName: tenant.orgName,
            email: tenant.email,
            phone: tenant.phone,
            website: tenant.website,
            logo: tenant.logo,
            industry: tenant.industry,
            address: tenant.address,
            subscription:
              tenant.subscription,
          },
        },

        description:
          `Tenant information updated for ${tenant.orgName}.`,

        status: "Success",

        isActive: true,
        isDeleted: false,
      });
    } catch (auditError) {
      console.error(
        "Tenant update audit log failed:",
        auditError
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Tenant updated successfully.",
      data: tenant,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------
// DELETE TENANT
// ---------------------------------------

export const deleteTenant = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      const error = new Error(
        "Invalid tenant ID."
      );

      error.statusCode = 400;
      error.auditReason =
        "Invalid tenant ID";

      throw error;
    }

    const tenant =
      await Tenant.findOne({
        _id: id,
        isDeleted: false,
      });

    if (!tenant) {
      const error = new Error(
        "Tenant not found."
      );

      error.statusCode = 404;
      error.auditReason =
        "Tenant was not found";

      throw error;
    }

    // Soft delete
    tenant.isDeleted = true;
    tenant.isActive = false;

    const updatedByUser =
      await User.findOne({
        _id: req.user.userId,
        isDeleted: false,
      }).lean();

    tenant.updatedBy = {
      userId: req.user.userId,

      name: updatedByUser
        ? `${updatedByUser.firstName || ""} ${
            updatedByUser.lastName || ""
          }`.trim()
        : "",

      role:
        updatedByUser?.role?.name ||
        req.user.role ||
        "",
    };

    await tenant.save();

    // --------------------------------
    // Audit Log
    // --------------------------------

    try {
      await AuditLog.create({
        tenant: {
          tenantId: tenant._id,
          orgName: tenant.orgName,
          email: tenant.email,
        },

        performedBy: {
          userId:
            req.user.userId,

          name:
            tenant.updatedBy.name,

          role:
            tenant.updatedBy.role,

          designation:
            updatedByUser?.designation ||
            null,
        },

        module: "Tenant",

        action: "Delete",

        relatedTo: {
          module: "Tenant",

          referenceId:
            tenant._id,

          title:
            tenant.orgName,
        },

        changes: {
          oldData: {
            orgName:
              tenant.orgName,

            email:
              tenant.email,

            isActive: true,

            isDeleted: false,
          },

          newData: {
            orgName:
              tenant.orgName,

            email:
              tenant.email,

            isActive: false,

            isDeleted: true,
          },
        },

        description:
          `Tenant ${tenant.orgName} was deleted.`,

        status: "Success",

        isActive: true,

        isDeleted: false,
      });
    } catch (auditError) {
      console.error(
        "Tenant delete audit log failed:",
        auditError
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Tenant deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
};