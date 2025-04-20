import nodemailer from 'nodemailer';
import config from '../../../config';

export const emailSender = async(email: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: config.email_sender.email,
            pass: config.email_sender.app_pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"PH Health Care 👻" <themorshedctg@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Reset Password Link", // Subject line
        // text: "Hello world?", // plain text body
        html
    });  
}