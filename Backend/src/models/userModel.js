import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
        mentorId : 
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user',
            default : null
        }
    },
    {
        timestamps : true
    }
)

const user = mongoose.model('Users', userSchema);

export default user;