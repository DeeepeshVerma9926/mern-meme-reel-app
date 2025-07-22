// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";             // Signup
import loginRoutes from "./routes/loginRoutes.js";     // Login
import dashboardRoutes from "./routes/dashboard.js";   // Protected dashboard
import uploadRoutes from './routes/upload.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);       // /api/auth/signup
app.use("/api/auth", loginRoutes);      // /api/auth/login
app.use("/api/dashboard", dashboardRoutes); // ✅ Protected route
app.use('/api/upload', uploadRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("✅ Server running on port " + process.env.PORT);
    });
  })
  .catch(err => console.log("❌ DB Error: ", err));
