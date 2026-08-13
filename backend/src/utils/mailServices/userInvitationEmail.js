import sendEmail  from "../emailSender.js";

const userInvitationEmail = async (email, token) => {
   
    const registrationLink =`${process.env.FRONTEND_URL}/user/register?token=${token}`;

    const subject = "TenantHub - User Registration Invitation";

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>TenantHub User Invitation</title>
        </head>

        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

            <h2>Welcome to TenantHub</h2>

            <p>
                You have been invited to create your TenantHub account.
            </p>

            <p>
                Please click the button below to complete your registration.
            </p>

            <p>
                <a
                    href="${registrationLink}"
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
                You will be asked to provide your personal details and
                create your account password.
            </p>

            <p>
                This invitation link will expire in 24 hours.
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

export default userInvitationEmail;