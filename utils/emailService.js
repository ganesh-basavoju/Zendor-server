import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create a transporter configured for Gmail
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_APP_PASSWORD // App password, not regular password
    }
  });

  // Define the email options
  const mailOptions = {
    from: `Zendorr Support <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;