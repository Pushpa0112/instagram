import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";

dotenv.config({});

const PORT = process.env.PORT || 8000;

// CORS must be first — handles preflight OPTIONS before body parsing or routing
const corsOptions = {
    origin: process.env.URL || "http://localhost:3000",
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Server is running",
        success: true
    });
});

// Route handlers
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// Trigger nodemon restart
server.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});