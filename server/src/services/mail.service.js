import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

export const sendQueueNotification = async (toEmail, patientName, tokenNumber, otpCode, patientId) => {
  const directLink = `${config.CLIENT_URI}/patient/track/${patientId}`;

  const mailOptions = {
    from: config.EMAIL_USER,
    to: toEmail,
    subject: "Queue Entry: Track Your Token Live",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Hello ${patientName},</h2>
        <p>You have been successfully added to the queue.</p>
        <p><b>Your Token Number:</b> #${tokenNumber}</p>
        <p><b>Your Verification OTP:</b> ${otpCode}</p>
        <p>You can track your live queue status directly by clicking the link below:</p>
        <p><a href="${directLink}" style="display: inline-block; padding: 10px 20px; background-color: #2459ff; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Track My Token Live</a></p>
        <p>If the button doesn't work, copy and paste this link in your browser:<br/>${directLink}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};

export const sendTurnNotification = async (toEmail, patientName, tokenNumber, patientId) => {
  const directLink = `${config.CLIENT_URI}/patient/track/${patientId}`;

  const mailOptions = {
    from: config.EMAIL_USER,
    to: toEmail,
    subject: "It's Your Turn: Proceed to Consulting Room",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Hello ${patientName},</h2>
        <p>It is now your turn! The doctor is ready to see you.</p>
        <p><b>Your Token Number:</b> #${tokenNumber}</p>
        <p>Please proceed to the consulting room immediately.</p>
        <p>You can track your live queue status directly by clicking the link below:</p>
        <p><a href="${directLink}" style="display: inline-block; padding: 10px 20px; background-color: #2459ff; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Track My Token Live</a></p>
        <p>If the button doesn't work, copy and paste this link in your browser:<br/>${directLink}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};
