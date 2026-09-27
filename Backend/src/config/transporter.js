import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth:{
        user : process.env.user,
        pass : process.env.pass
    }
})

export default transporter;