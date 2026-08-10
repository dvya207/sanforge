/**
 * Send an email using Brevo (Sendinblue) HTTP API.
 * Works on local and Render free tier (no SMTP ports needed).
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML body
 */
export const sendEmail = async (to, subject, html) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not defined in environment variables");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "SanForge",
        email: senderEmail || "divyairandoor@gmail.com",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Brevo API error:", error);
    throw new Error(`Brevo error: ${JSON.stringify(error)}`);
  }

  return await response.json();
};
