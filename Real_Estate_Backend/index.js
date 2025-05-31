// Importing necessary modules and packages
const express = require("express");
const app = express();
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const UserAuth = require("./routes/UserAuth");
const propertyRoutes = require("./routes/propertyRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const profileRoutes = require("./routes/profileRoutes");
const AdminRoutes = require("./routes/AdminRoutes");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const path = require("path");

// Loading environment variables from .env file
dotenv.config();

// Setting up port number
const PORT = process.env.PORT || 4000;

// Connecting to database
database.connectwithDb();

// Connecting to Cloudinary
cloudinaryConnect();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*", // Update with your frontend URL for production
    credentials: true,
  })
);

// File upload middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"), // Temporary directory for file uploads
  })
);

// Setting up routes
app.use("/api/v1/auth", UserAuth);
app.use("/api/v1/property", propertyRoutes);
app.use("/api/v1/review", reviewRoutes);

app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/admin", AdminRoutes);
app.use("/api/v1/admin", propertyRoutes);


// Testing the server
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// Listening to the server
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
