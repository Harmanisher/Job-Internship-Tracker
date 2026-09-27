import user from '../models/userModel.js'
import temporaryUser from '../models/temporaryUser.js';
import crypto from 'crypto';
import bcrypt from "bcrypt";
import transporter from '../config/transporter.js';
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';

export async function signup(req,res)
{
    try
    {
        const {name, email, password, mentorId} = req.body;
    
    const existingUser = await user.findOne({email});

    if(existingUser)
    {
        return res.status(400).json({ message: 'User already registered. You can log in' });
    }

    if (mentorId) {
      if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        return res.status(400).json({ message: "Invalid mentor selected." });
      }
      
      // optional : check if mentor exists or not
      const Mentor = await user.findById(mentorId);
      if(!Mentor)
        {
            return res.status(400).json({message : "Invalid Mentor Selected"});
        }
    }


    // ***otp generation.
    const otp = crypto.randomInt(100000, 1000000).toString();
    console.log(otp);

    const otpExpiry = new Date(Date.now() + 10*60*1000); // otp will bw valid only for 10 minutes.

    // ***Delete already registered user.
    await temporaryUser.deleteOne({email : email});

    
    // **** Hash the password
    const hashedPassword = await bcrypt.hash(password,10);

    // **** Store the registered temporary user
    await temporaryUser.create({
        name : name,
        email : email,
        password : hashedPassword,
        mentorId : mentorId||null,
        otp : otp,
        otpExpiry : otpExpiry
    });


    //*** Send the otp via Mail 

    const mailOptions = {
        from : process.env.user,
        to : email,
        subject: "Verify Your Email - Your OTP Code",
        text: `
    Hello,

    Thank you for registering with Job & Internship Tracker.

    To complete your registration, please verify your email using the OTP below:

    Your OTP: ${otp}

    This OTP is valid for 10 minutes and can only be used once.

    For your security:
    - Do not share this OTP with anyone.
    - Our team will never ask you for your OTP.
    - If you did not request this verification code, you can safely ignore this email.

    Best regards,
    Job & Internship Tracker Team

    This is an automated email. Please do not reply.
        `
    }

    await transporter.sendMail(mailOptions, (err,info)=>{
        if(err)
        {
            console.log("Email can't be sent : ",err.message);
        }
        else
        {
            console.log("Email sent Successfully!");
        }
    })

        // Instead of: res.redirect(`/verify?email=${encodeURIComponent(email)}`);
            res.status(200).json({ message: "OTP sent. Please verify your email.", email: email });
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send("Something went wrong during Registration!");
    }
}

export async function resend(req,res)
{
    try
    {
        const {email} = req.body;

    if(!email)
    {
        return res.status(400).json({message : "Email is Required!"});
    }

    const findUser = await temporaryUser.findOne({email : email});

    if(!findUser)
    {
        return res.status(404).json({message : "User not registered!"});
    }

    // **** Generate Otp.
    const newotp = crypto.randomInt(100000, 1000000).toString();
    console.log("newotp",newotp);

    const newotpExpiry = new Date(Date.now() + 10*60*1000); // otp will bw valid only for 10 minutes.

    const id = findUser._id;
    await temporaryUser.findByIdAndUpdate(id,{
        otp : newotp,
        otpExpiry : newotpExpiry
    });

    // ****Send new otp via Mail
    const mailOptions = {
        from : process.env.user,
        to : email,
        subject: "Verify Your Email - Your OTP Code",
        text: `
    Hello,

    Thank you for registering with Job & Internship Tracker.

    To complete your registration, please verify your email using the OTP below:

    Your OTP: ${newotp}

    This OTP is valid for 10 minutes and can only be used once.

    For your security:
    - Do not share this OTP with anyone.
    - Our team will never ask you for your OTP.
    - If you did not request this verification code, you can safely ignore this email.

    Best regards,
    Job & Internship Tracker Team

    This is an automated email. Please do not reply.
        `
    }

    await transporter.sendMail(mailOptions, (err,info)=>{
        if(err)
        {
            console.log("Email can't be sent : ",err.message);
        }
        else
        {
            console.log("Email sent Successfully!");
        }
    })    

        res.status(200).json({message:"Otp resend Successfully!"})
    }

    catch(err)
    {
        console.log(err);
        res.status(500).json({message : "Something went Wrong"});
    }

}


export async function verify(req,res)
{
    try
    {
            const {email, otp} = req.body;

        const findUser = await temporaryUser.findOne({email : email});

        if(!findUser)
        {
            return res.status(401).json({message : "Please Register First!"});
        }

        // *** Check otp Expiry
        if(findUser.otpExpiry < new Date())
        {
            await temporaryUser.deleteOne({email : email});
            return res.status(400).json({message : "Otp Expired. Please Register Again!"});
        }

        // *** otp validation
        if(findUser.otp != otp)
        {
            return res.status(400).json({message : "Invlaid Otp!"});
        }

        // *** Save the User Permanently in user collection
        await user.create({
            name : findUser.name,
            email : findUser.email,
            password : findUser.password,
            role : findUser.role,
            mentorId : findUser.mentorId
        })

        await temporaryUser.deleteOne({email : email});
        res.status(200).json({message : "Email Verified! Account created successfully"});
    }

    catch(err)
    {
        console.log(err);
        res.status(500).json({message : "Something went Wrong during verification."});
    }

}

export async function login(req,res)
{
    try
    {
        const {email,password} = req.body;

        const findUser = await user.findOne({email : email});

        if(!findUser)
        {
            return res.status(401).json({message : "User Not Found! Please Register the user first"});
        }

        // *** Password validation using bcrypt.compare().
        const isMatch = await bcrypt.compare(password,findUser.password);

        if(!isMatch)
        {
            return res.status(401).json({message : "Invalid Email or Password!"});
        }


        // ***Create JWT and store it in the cookie if userdetails are correct and user has successfully logged in.
        const token = jwt.sign({ id : findUser.id, email : findUser.email, role : findUser.role}, process.env.SECRET, {expiresIn : "1h"});

        console.log(token);

        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 60 * 60 * 1000, // 1 hour
        });

        console.log("cookie sent");

        // Send back user info (never the password) so React can update its UI/state.
        res.status(200).json({
          message: "Login successful",
          user: {
            id: findUser._id,
            name: findUser.name,
            email: findUser.email,
            role: findUser.role,
          },
        });
    }

    catch(err)
    {
        console.log(err);
        res.status(500).json({message : "Something went wrong during login!"});
    }

}

export async function logout(req,res)
{
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return res.status(200).json({message : "Logged out successfully!"});
}

export async function getMe(req,res)
{
    try
    {
        const User = await user.findById(req.user.id).select('-password');

        if(!User)
        {
            return res.status(404).json({message : "User not Found!"});
        }
        res.status(200).json({User});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message : "Something went Wrong!"});
    }
}


export async function UpdateMe(req,res)
{
    try {
    const { name, mentorId } = req.body;
    const updateData = {};

    if (name) updateData.name = name; // ⚠️ confirm this matches your actual field casing — Name vs name

    // mentorId only applies to students; silently ignored for mentors
    // rather than erroring, since the frontend won't send it for them.
    if (req.user.role === 'student' && mentorId !== undefined) {
      if (mentorId && !mongoose.Types.ObjectId.isValid(mentorId)) {
        return res.status(400).json({ message: "Invalid mentor selected" });
      }
      if (mentorId) {
        const mentor = await user.findOne({ _id: mentorId, role: 'mentor' });
        if (!mentor) {
          return res.status(400).json({ message: "Selected mentor not found" });
        }
      }
      updateData.mentorId = mentorId || null;
    }

    const updatedUser = await user.findByIdAndUpdate(req.user.id, updateData, {
      returnDocument: 'after' 
    }).select('-password'); // ⚠️ confirm casing here too

    return res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
}


export async function updatePassword(req,res)
{

    try
    {
            const {currentPassword , newPassword} = req.body;

        if(!currentPassword || !newPassword)
        {
            return res.status(400).json({message : "Both Current and New Password are Required!"});
        }

        const findUser = await user.findById(req.user.id);
        if(!findUser)
        {
            return res.status(400).json({message : "User Not Found!"});
        }

        const isMatch = await bcrypt.compare(currentPassword,findUser.password);
        if(!isMatch)
        {
            return res.status(400).json({message : "Current Password is not correct!"});
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);
        await user.findByIdAndUpdate(req.user.id, {password : hashedPassword});

        return res.status(200).json({message : "Password Updated Successfully!"});
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({message : "Something went wrong!"});
    }

}