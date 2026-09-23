import mongoose from "mongoose";

import Tenant from "../models/Tenant.js";

import tenantRegistrationService from "../services/tenantRegistrationService.js";

import verifyToken from "../utils/tokenVerifier.js";

// ---------------------------------------
// REGISTER TENANT
// ---------------------------------------

export const registerTenant = async (
  req,
  res,
  next
) => {
  try {
    const {
      token,
      firstName,
      lastName,
      phone,
      location,
      password,
    } = req.body;

    const result =
      await tenantRegistrationService({
        token,
        firstName,
        lastName,
        phone,
        location,
        password,
      });

    return res.status(201).json({
      success: true,
      message:
        "Tenant registration submitted successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------
// VALIDATE TENANT INVITATION
// ---------------------------------------

export const validateTenantInvitation =
  async (req, res, next) => {
    try {
      const { token } = req.body;

      // ---------------------------------------
      // CHECK TOKEN
      // ---------------------------------------

      if (!token) {
        return res.status(400).json({
          success: false,
          message:
            "This invitation is no longer valid.",
        });
      }

      // ---------------------------------------
      // VERIFY TOKEN
      // ---------------------------------------

      const tokenPayload =
        verifyToken(token);

      if (!tokenPayload) {
        return res.status(401).json({
          success: false,
          message:
            "This invitation is no longer valid.",
        });
      }

      // ---------------------------------------
      // CHECK TOKEN PURPOSE
      // ---------------------------------------

      if (
        tokenPayload.purpose !==
        "TenantInvitation"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "This invitation is no longer valid.",
        });
      }

      // ---------------------------------------
      // GET TENANT FROM TOKEN
      // ---------------------------------------

      const tenantId =
        tokenPayload?.tenant?.tenantId;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          message:
            "This invitation is no longer valid.",
        });
      }

      // ---------------------------------------
      // CHECK TENANT ID
      // ---------------------------------------

      if (
        !mongoose.Types.ObjectId.isValid(
          tenantId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "This invitation is no longer valid.",
        });
      }

      // ---------------------------------------
      // FIND TENANT
      // ---------------------------------------

      const tenant =
        await Tenant.findOne({
          _id: tenantId,
          isDeleted: false,
        }).lean();

      // ---------------------------------------
      // TENANT NOT FOUND / DELETED
      // ---------------------------------------

      if (!tenant) {
        return res.status(404).json({
          success: false,
          message:
            "This invitation is no longer valid.",
        });
      }

      // ---------------------------------------
      // CHECK INVITATION STATUS
      // ---------------------------------------

      if (
        tenant.subscription?.status !==
        "Pending"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "This invitation is no longer valid.",
        });
      }

      // ---------------------------------------
      // VALID INVITATION
      // ---------------------------------------

      return res.status(200).json({
        success: true,
        message:
          "Invitation is valid.",
        data: {
          tenantId: tenant._id,
          organizationName:
            tenant.orgName,
          email: tenant.email,
        },
      });
    } catch (error) {
      next(error);
    }
  };

// ---------------------------------------
// DEFAULT EXPORT
// ---------------------------------------

export default {
  registerTenant,
  validateTenantInvitation,
};