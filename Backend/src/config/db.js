import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.Mongo_Url;

async function dbConnection()
{
    await mongoose.connect(url);
    console.log("MongoDB connected Successfully!");
}

export default dbConnection;