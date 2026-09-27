import application from '../models/applicationModel.js';

export async function createApplication(req,res)
{
    try
    {
        const {company, role, status, notes} = req.body;

        if(!company || !role)
        {
            return res.status(500).json({message : "Company and Role are Required"});
        }

        const appli = await application.create({
            studentId : req.user.id,
            company : company,
            role : role,
            status : status,
            notes : notes
        });

        console.log(appli);

        res.status(201).json({message : "Application created Successfully!"});
    }

    catch(err)
    {
        console.log(err);
        res.status(500).json({message : "Something went wrong!"});
    }
}   


export async function getMyApplications(req,res)
{
    try
    {
        const applications = await application.find({studentId : req.user.id});
        console.log(applications);

        res.status(200).json({applications});
    }

    catch(err)
    {
        console.log(err);
        res.status(500).json({message : "Something went wrong!"});
    }
}

export async function getSingleApplication(req,res)
{
    try
    {
        const id = req.params.id;

        const SingleApplication = await application.findById(id);

        if(!SingleApplication)
        {
            return res.status(404).json({message : "Application not found"});
        }

        // Ownership check — critical security step
        if(SingleApplication.studentId.toString() !== req.user.id)
        {
            return res.status(403).json({ message: "You don't have permission to update this application."});
        }

        res.status(200).json({SingleApplication});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message : "Something went Wrong!"});
    }
}

export async function updateApplication(req,res)
{   
    try
    {
        const id = req.params.id;

        const takeapplication = await application.findById(id);

        if(!takeapplication)
        {
            return res.status(404).json({message : "Application not found"});
        }

        // Ownership check — critical security step
        if(takeapplication.studentId.toString() !== req.user.id)
        {
            return res.status(403).json({ message: "You don't have permission to update this application."});
        }

        // save the changes.
        const updatedApplication = await application.findByIdAndUpdate(id, req.body);
        res.status(200).json({ message: "Application updated successfully", updatedApplication });
    }

    catch(err)
    {
        console.log(err);
        res.status(500).json({message : "Something went Wrong!"});
    }

}



export async function deleteApplication(req,res)
{
    try
    {
            const id = req.params.id;

        const takeapplication = await application.findById(id);

        if(!takeapplication)
        {
            return res.status(404).json({message : "Application not found"});
        }

        // Ownership check — critical security step
        if(takeapplication.studentId.toString() !== req.user.id)
        {
            return res.status(403).json({ message: "You don't have permission to delete this application." });
        }

        // save the changes.
        await application.findByIdAndDelete(id);
        res.status(200).json({ message: "Application Deleted successfully"});
    }

    catch(err)
    {
        console.log(err);
        res.status(500).json({message : "Something went Wrong!"});
    }

}