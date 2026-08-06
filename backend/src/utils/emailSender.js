const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async ({ to, subject, html }) => {
    try {

        await transporter.sendMail({
            from: `"TenantHub Team" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });

        return true;

    } catch (error) {
        console.error("Email Error:", error);
        const err = new Error("Failed to send email");
        err.statusCode = 500;
        throw err;
    }
};

module.exports = {
    sendEmail,
    
};