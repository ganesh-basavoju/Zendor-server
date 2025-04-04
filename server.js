import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import  authRoutes  from "./routes/authRoute.js";
import userRoutes from "./routes/userRoutes.js";
import {connectDB} from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE", "PUT"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma",
        ],
        credentials: true,
    })
);

app.use(express.json()); 
app.use(cookieParser());

app.use("/api/auth", authRoutes); 
app.use("/api/user", userRoutes);


app.listen(PORT, () => {
	console.log("Server is running on http://localhost:" + PORT);
	connectDB();
});