import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email using Resend API (OTP emails).
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML body
 */
export const sendEmail = async (to, subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM, // e.g. "Your Name <you@example.com>"
      to,
      subject,
      html,
    });
    if (error) {
      throw new Error(`Resend error: ${JSON.stringify(error)}`);
    }
    return data;
  } catch (err) {
    console.error("Resend sendEmail error", err);
    throw err;
  }
};
