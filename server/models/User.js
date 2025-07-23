// server/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, min: 2 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, min: 6 },
  phone: { type: String, required: true, min: 10, max: 10 },
  profilePic: { type: String }, // ✅ This line is necessary
});

export default mongoose.model("User", UserSchema);
