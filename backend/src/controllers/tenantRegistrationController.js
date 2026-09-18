import tenantRegistrationService from "../services/tenantRegistrationService.js";

export const registerTenant = async (req, res, next) => {
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
                "Tenant registration submitted successfully. Your account is pending approval.",
            data: result,
        });
    } catch (error) {
        error.auditDetails = {
            module: "Tenant",
            action: "Register",
            reason:
                error.auditReason ||
                error.message,
        };

        next(error);
    }
};