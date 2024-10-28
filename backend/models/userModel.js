import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  phoneNumber: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.index({ email: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model("User", userSchema);

export default User;
