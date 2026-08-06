const { sendEmail } = require("../utils/emailSender");

const sendTenantInvitationEmail = async (email, token) => {

    const onboardingLink = `${process.env.FRONTEND_URL}/tenant/onboarding?token=${token}`;

    const subject = "HRMS Tenant Invitation";

    const html = `
        <h2>Welcome to TenantHub</h2>

        <p>Hello,</p>

        <p>
            You have been invited by the Enterprise Admin to register your organization on TenantHub.
        </p>

        <p>
            Please click the button below to complete your onboarding.
        </p>

        <p>
            <a href="${onboardingLink}"
               style="
                    background:#2563eb;
                    color:#ffffff;
                    padding:12px 24px;
                    text-decoration:none;
                    border-radius:6px;
                    display:inline-block;
               ">
                Complete Onboarding
            </a>
        </p>

        <p>
            This invitation link will expire in 24 hours.
        </p>

        <p>
            If you did not expect this invitation, you can safely ignore this email.
        </p>

        <br>

        <p>
            Regards,<br>
            TenantHub Team
        </p>
    `;

    await sendEmail({
        to: email,
        subject,
        html
    });
};


const sendTenantApprovalEmail = async (email, orgName) => {

    const loginLink = `${process.env.FRONTEND_URL}/login`;

    const subject = "Organization Approved - Welcome to TenantHub";

    const html = `
        <h2>Congratulations! Your Organization Has Been Approved</h2>

        <p>Hello,</p>

        <p>
            We are pleased to inform you that your organization
            <strong>${orgName}</strong> has been successfully approved by the Enterprise Administrator.
        </p>

        <p>
            Your Tenant Administrator account has also been activated.
            You can now sign in to TenantHub and begin setting up your organization.
        </p>

        <p>
            <a href="${loginLink}"
               style="
                    background:#16a34a;
                    color:#ffffff;
                    padding:12px 24px;
                    text-decoration:none;
                    border-radius:6px;
                    display:inline-block;
               ">
                Login to TenantHub
            </a>
        </p>

        <p>
            After logging in, you can:
        </p>

        <ul>
            <li>Configure your organization.</li>
            <li>Create departments and roles.</li>
            <li>Add employees.</li>
            <li>Start managing your workforce.</li>
        </ul>

        <p>
            If you have any questions or need assistance, please contact our support team.
        </p>

        <br>

        <p>
            Regards,<br>
            TenantHub Team
        </p>
    `;

    await sendEmail({
        to: email,
        subject,
        html
    });
};

const sendTenantRejectionEmail = async (
                                email,
                                orgName,
                                safeReason
                            ) => 
    {

    const subject = "Organization Registration Status - TenantHub";

    const html = `
        <h2>Organization Registration Update</h2>

        <p>Hello,</p>

        <p>
            Thank you for registering your organization
            <strong>${orgName}</strong> with TenantHub.
        </p>

        <p>
            After reviewing your registration, we regret to inform you that your organization has not been approved at this time.
        </p>

        <p>
            <strong>Reason for Rejection:</strong><br>
            ${safeReason}
        </p>

        <p>
            You may review the above reason, make the necessary corrections, and submit a new registration request if applicable.
        </p>

        <p>
            If you believe this decision was made in error or you need further clarification, please contact our support team.
        </p>

        <br>

        <p>
            Regards,<br>
            TenantHub Team
        </p>
    `;

    await sendEmail({
        to: email,
        subject,
        html
    });
};


module.exports = {
    sendTenantInvitationEmail,
    sendTenantApprovalEmail,
    sendTenantRejectionEmail
};