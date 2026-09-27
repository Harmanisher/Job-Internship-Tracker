import mongoose from "mongoose";

const temporary = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        role : {
            type : String,
            enum : ['student','mentor'],
            default : 'student'
        },
        mentorId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user',
            default : null
        },
        otp : {
            type : String,
            required : true,
        },
        otpExpiry : {
            type : Date,
            required : true
        }
    },
    {
        timestamps : true
    }
)

const temporaryUser = mongoose.model('temporary_User', temporary);

export default temporaryUser;

