import nodemailer from "nodemailer";
import { SMTP_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from "../config/serverConfig.js";

let transporter = null;

const canSendEmail = () => Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && SMTP_FROM);

const getTransporter = () => {
    if (transporter) return transporter;

    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    return transporter;
};

export const sendOfficerOnboardingEmail = async ({
    to,
    officerId,
    fullName,
    badgeNo,
    rankCode,
    thanaId,
    nidNumber,
    fatherName,
    motherName,
    birthDate,
    age,
    imageUrl,
    loginEmail,
    plainPassword,
}) => {
    if (!canSendEmail()) {
        console.log("SMTP configuration missing. Skipping officer onboarding email.");
        return { skipped: true };
    }

    const subject = `Officer Registration Completed • ${officerId}`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #0f172a;">
            <h2 style="margin-bottom: 8px;">Welcome to Black Vein Oracle</h2>
            <p style="margin-top: 0; color: #334155;">Your officer account has been created.</p>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-top: 16px;">
                <h3 style="margin-top: 0;">Officer Details</h3>
                <p><strong>Officer ID:</strong> ${officerId}</p>
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Badge No:</strong> ${badgeNo}</p>
                <p><strong>Rank:</strong> ${rankCode}</p>
                <p><strong>Thana ID:</strong> ${thanaId}</p>
                <p><strong>NID:</strong> ${nidNumber}</p>
                <p><strong>Father's Name:</strong> ${fatherName}</p>
                <p><strong>Mother's Name:</strong> ${motherName}</p>
                <p><strong>Birth Date:</strong> ${birthDate}</p>
                <p><strong>Age (calculated):</strong> ${age ?? "N/A"}</p>
                ${imageUrl ? `<p><strong>Image URL:</strong> <a href="${imageUrl}">${imageUrl}</a></p>` : ""}
            </div>

            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 16px; margin-top: 16px;">
                <h3 style="margin-top: 0; color: #1d4ed8;">Login Credentials</h3>
                <p><strong>Username/Email:</strong> ${loginEmail}</p>
                <p><strong>Password:</strong> ${plainPassword}</p>
            </div>

            <p style="margin-top: 16px; color: #334155;">
                Please sign in and change your password from your officer profile as soon as possible.
            </p>
        </div>
    `;

    const text = `
Welcome to Black Vein Oracle

Your officer account has been created.

Officer Details:
- Officer ID: ${officerId}
- Full Name: ${fullName}
- Badge No: ${badgeNo}
- Rank: ${rankCode}
- Thana ID: ${thanaId}
- NID: ${nidNumber}
- Father's Name: ${fatherName}
- Mother's Name: ${motherName}
- Birth Date: ${birthDate}
- Age (calculated): ${age ?? "N/A"}
${imageUrl ? `- Image URL: ${imageUrl}` : ""}

Login Credentials:
- Username/Email: ${loginEmail}
- Password: ${plainPassword}

Please sign in and change your password from your officer profile as soon as possible.
    `;

    const mail = {
        from: SMTP_FROM,
        to,
        subject,
        text,
        html,
    };

    const tx = getTransporter();
    const info = await tx.sendMail(mail);
    return { skipped: false, messageId: info.messageId };
};
