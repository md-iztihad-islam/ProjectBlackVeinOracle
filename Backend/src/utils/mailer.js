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
    gender,
    age,
    imageUrl,
    loginEmail,
    plainPassword,
}) => {
    if (!canSendEmail()) {
        console.log("SMTP configuration missing. Skipping officer onboarding email.");
        return { skipped: true };
    }

    const subject = `Officer Onboarding Confirmation • ${officerId}`;

    const formatDate = (value) => {
        if (!value) return "N/A";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return String(value);
        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    };

    const rankLabel = String(rankCode || "").replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const attachments = [];
    if (imageUrl) {
        try {
            const response = await fetch(imageUrl);
            if (response.ok) {
                const imageBuffer = Buffer.from(await response.arrayBuffer());
                const mimeType = response.headers.get("content-type") || "image/jpeg";
                const extension = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
                attachments.push({
                    filename: `officer-${officerId}.${extension}`,
                    content: imageBuffer,
                    contentType: mimeType,
                    cid: "officer-photo",
                });
            }
        } catch (error) {
            console.log("Could not attach officer image in email:", error?.message || error);
        }
    }

    const html = `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #0f172a;">
            <div style="background:#0f172a;color:#e2e8f0;padding:18px 22px;border-radius:12px 12px 0 0;">
                <h2 style="margin:0;font-size:20px;">Black Vein Oracle</h2>
                <p style="margin:6px 0 0 0;color:#cbd5e1;">Officer Onboarding Notice</p>
            </div>

            <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:18px 22px;background:#ffffff;">
                <p style="margin-top:0;color:#334155;">Dear <strong>${fullName}</strong>, your officer account has been successfully created.</p>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-top: 16px;">
                <h3 style="margin-top: 0; margin-bottom: 10px;">Officer Details</h3>
                <p><strong>Officer ID:</strong> ${officerId}</p>
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Badge No:</strong> ${badgeNo}</p>
                <p><strong>Rank:</strong> ${rankLabel || rankCode}</p>
                <p><strong>Thana ID:</strong> ${thanaId}</p>
                <p><strong>NID:</strong> ${nidNumber}</p>
                <p><strong>Father's Name:</strong> ${fatherName}</p>
                <p><strong>Mother's Name:</strong> ${motherName}</p>
                <p><strong>Birth Date:</strong> ${formatDate(birthDate)}</p>
                <p><strong>Gender:</strong> ${gender || "N/A"}</p>
                <p><strong>Age:</strong> ${age ?? "N/A"}</p>
                ${attachments.length > 0 ? `
                    <div style="margin-top:12px;">
                        <p style="margin-bottom:8px;"><strong>Officer Image</strong></p>
                        <img src="cid:officer-photo" alt="Officer" style="width:110px;height:110px;border-radius:9999px;object-fit:cover;border:2px solid #cbd5e1;" />
                    </div>
                ` : ""}
            </div>

            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 16px; margin-top: 16px;">
                <h3 style="margin-top: 0; color: #1d4ed8;">Login Credentials</h3>
                <p><strong>Username/Email:</strong> ${loginEmail}</p>
                <p><strong>Password:</strong> ${plainPassword}</p>
            </div>

            <p style="margin-top: 16px; color: #334155; margin-bottom:0;">
                Please sign in and change your password from your officer profile as soon as possible.
            </p>
            </div>
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
- Birth Date: ${formatDate(birthDate)}
- Gender: ${gender || "N/A"}
- Age: ${age ?? "N/A"}

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
        attachments,
    };

    const tx = getTransporter();
    const info = await tx.sendMail(mail);
    return { skipped: false, messageId: info.messageId };
};
