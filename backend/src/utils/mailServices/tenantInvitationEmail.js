import sendEmail from "../emailSender.js";

const tenantInvitationEmail = async (
    email,
    token,
    organizationName
) => {
    const registrationLink =
        `${process.env.FRONTEND_URL}/tenant-register?token=${encodeURIComponent(token)}`;

    const subject =
        "TenantHub - Tenant Registration Invitation";

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <title>TenantHub Tenant Invitation</title>
        </head>

        <body
            style="
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            "
        >

            <h2>Welcome to TenantHub</h2>

            <p>
                You have been invited to register
                <strong>${organizationName}</strong>
                with TenantHub.
            </p>

            <p>
                Please click the button below to complete your registration.
            </p>

            <p>
                <a
                    href="${registrationLink}"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                    "
                >
                    Complete Registration
                </a>
            </p>

            <p>
                During registration, you will be asked to provide your
                personal details and create your account password.
            </p>

            <p>
                This registration link will expire in
                <strong>2 hours</strong>.
            </p>

            <p>
                If you were not expecting this invitation, you can safely
                ignore this email.
            </p>

            <p>
                Regards,<br />
                <strong>TenantHub Team</strong>
            </p>

        </body>
        </html>
    `;

    await sendEmail({
        to: email,
        subject,
        html,
    });
};

export default tenantInvitationEmail;