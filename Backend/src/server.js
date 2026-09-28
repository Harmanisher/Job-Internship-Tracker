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
    origin: function (origin, callback) {

        const allowedOrigins = [
            "http://localhost:5173",
            "https://job-internship-tracker-phi.vercel.app"
        ];

        // Allow requests without an Origin
        // such as some server-to-server requests
        if (!origin) {
            return callback(null, true);
        }

        // Allow the main Vercel URL and Vercel deployment URLs
        if (
            allowedOrigins.includes(origin) ||
            /^https:\/\/job-internship-tracker-[a-z0-9-]+-isher-404\.vercel\.app$/.test(origin)
        ) {
            return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

// *****Routes
app.use('/api/auth',authRoutes);      //Authentication Route

app.use('/api/applications',applicationRoutes)   //Application Route

app.use('/api',mentorRoutes);


async function startServer()
{
    await dbConnection();
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

}

startServer();