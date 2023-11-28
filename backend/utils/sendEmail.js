const nodemailer = require("nodemailer");

exports.sendEmail = async (subject, message, sent_to, sent_from, reply_to) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        secure: false,
        tls: {
            rejectUnauthorized: false,
        },
    });

    const options = {
        from: sent_from,
        to: sent_to,
        replyTo: reply_to,
        subject: subject,
        html: message,
    };

    // send email using async/await
    try {
        const info = await transporter.sendMail(options);
        console.log(info);
    } catch (err) {
        console.error(err);
    }
};
