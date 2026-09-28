

// **** This code works for the localhost but when we deploy our code on Render, we are not able to maintain or create the SMTP connection, so we use Resend that handles with the SMTP connection itself.
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


// ***** Resend Code : 
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;