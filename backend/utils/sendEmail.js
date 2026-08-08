/**
 * Send an email using Brevo (Sendinblue) HTTP API.
 * Works on Render free tier (no SMTP ports needed).
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML body
 */
export const sendEmail = async (to, subject, html) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "SanForge",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Brevo error: ${JSON.stringify(error)}`);
  }

  return await response.json();
};
