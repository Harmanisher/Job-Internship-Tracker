import user from "../models/userModel.js"
import application from "../models/applicationModel.js";

export async function getAllMentors(req,res)
{
    try
    {
        const mentors = await user.find({role : 'mentor'}).select('name email');
        res.status(200).json({mentors});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message : "Something went Wrong!"});
    }
}


export async function getMyStudents(req,res)
{
    try
    {
        const students = await user.find({mentorId : req.user.id}).select('-password');

        res.status(200).json({students});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message : "Something went wrong!"});
    }
}


export async function getStudentApplications(req,res)
{
    try
    {
            const id = req.params.studentId;
            console.log(id);

        // check if student exists or not.
        const student = await user.findById(id).select('-password');
        // console.log(student);
        if(!student)
        {
            return res.status(404).json({message : "Student not Found!"});
        }

        // check if the user belongs to this mentor.
        if(student.mentorId.toString() !== req.user.id)
        {
            return res.status(403).json({ message: "This student is not assigned to you." });
        }


        const applications = (await application.find({studentId : id}));

        res.status(200).json({student, applications});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message : "Something went wrong"});
    }
}