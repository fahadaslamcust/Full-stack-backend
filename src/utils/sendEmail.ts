import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions) => {
  // 1. Create a transporter (Use Mailtrap credentials for testing)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
    port: Number(process.env.EMAIL_PORT) || 2525,
    auth: {
      user: process.env.EMAIL_USERNAME, // Add to your .env file
      pass: process.env.EMAIL_PASSWORD, // Add to your .env file
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: '"CampusConnect Admin" <noreply@campusconnect.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};
