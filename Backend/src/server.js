import e from "express";
import dbConnection from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from './routes/applicationRoutes.js'
import mentorRoutes from './routes/mentorRoutes.js'
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = e();

app.use(e.json());
app.use(e.urlencoded({extended : true}));
app.use(cookieParser());

// *** cors
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

// *****Routes
app.use('/api/auth',authRoutes);      //Authentication Route

app.use('/api/applications',applicationRoutes)   //Application Route

app.use('/api',mentorRoutes);


async function startServer()
{
    await dbConnection();
    app.listen(process.env.PORT || 5000);
}

startServer();