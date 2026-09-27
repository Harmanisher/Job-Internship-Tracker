import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    
    studentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },
    company : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true,
    },
    status : {
        type : String,
        enum : ['Applied', 'OA', 'Interview', 'Offer', 'Rejected'],
        default : 'Applied'
    },
    dateApplied : {
        type : Date,
        default : Date.now
    },
    notes : {
        type : String,
        default : ''
    }
},
{
    timeStamps : true
}
)

const application = mongoose.model('Application', applicationSchema);

export default application;