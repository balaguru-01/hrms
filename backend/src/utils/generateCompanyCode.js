const Tenant = require("../models/Tenant");

const generateCompanyCode = async () => {
    const PREFIX = "TEN";

    const latestTenant = await Tenant.findOne()
        .sort({ companyCode: -1 })
        .select("companyCode");

    if (!latestTenant) {
        return `${PREFIX}001`;
    }

    const currentNumber = Number.parseInt(
        latestTenant.companyCode.replace(PREFIX, ""),
        10
    );

    if (Number.isNaN(currentNumber)) {
        throw new Error("Invalid company code found in database.");
    }

    const nextNumber = currentNumber + 1;

    return `${PREFIX}${String(nextNumber).padStart(3, "0")}`;
};

module.exports = { generateCompanyCode };