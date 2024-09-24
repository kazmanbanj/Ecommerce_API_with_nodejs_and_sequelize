import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST as string,
    port: parseInt(process.env.MAIL_PORT as string, 10),
    auth: {
        user: process.env.MAIL_USERNAME as string,
        pass: process.env.MAIL_PASSWORD as string,
    },
});

// Function to send email
const sendSignupEmail = async (to: string, subject: string, name: string) => {
    const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome Email</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    font-family: Arial, sans-serif;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    margin-top: 40px;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #333333;
                }
                p {
                    color: #666666;
                    line-height: 1.5;
                }
                .footer {
                    text-align: center;
                    padding: 10px 0;
                    font-size: 12px;
                    color: #999999;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h3></h3>
                <p>Hi, ${name}!</p>
                <p>Thank you for signing up. We're excited to have you on board.</p>
                <p>If you have any questions, feel free to reach out to our support team.</p>
                <p>Best regards,<br>The Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Our Service, Inc. All rights reserved.</p>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: to,
        subject: subject,
        // text: text,
        html: htmlTemplate,
    };

    try {
        const sendMail = await transporter.sendMail(mailOptions);
        console.log('Email sent:', sendMail.response);
    } catch (error) {
        console.log('Error:', error);
    }
};

export default sendSignupEmail;
