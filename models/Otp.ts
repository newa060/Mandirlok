import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL index — MongoDB auto-deletes expired docs
});

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);