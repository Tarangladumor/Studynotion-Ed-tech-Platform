const express = require("express");
const mongoose = require("mongoose");
const app = express();

const userRoutes = require("./routers/User");
const profileRoutes = require("./routers/Profile");
const courseRoutes = require("./routers/Course");
const paymentRoutes = require("./routers/Payments");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

// Connect to the database
database.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                "https://studynotion-ed-tech-platform-brown.vercel.app",
                // Add other allowed origins if needed
            ];
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

// Cloudinary connection
cloudinaryConnect();

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running....",
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Your server started at ${PORT}`);
});
