

// **** This code works for the localhost but when we deploy our code on Render, we are not able to maintain or create the SMTP connection, so we use Mailjet that handles with the SMTP connection itself.
/*
import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth:{
        user : process.env.user,
        pass : process.env.pass
    }
})

export default transporter;
*/


import Mailjet from "node-mailjet";

const transporter = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
);

export default transporter;