import express from "express";
import cors from "cors";
import users from "./routes/users.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
const app = express();
// Enables CORS so your front-end can access your backend API without browser blocking it.
app.use(cors());
// Allows Express to parse JSON data from incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/users', users);
// Set port
const PORT = process.env.PORT || 5050;
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});