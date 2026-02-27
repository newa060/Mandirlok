import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  gotra?: string;
  dob?: string;
  address?: string;
  photo?: string;
  role: "user" | "admin";
  isActive: boolean;
  lastLogin?: Date;
  savedTemples: mongoose.Types.ObjectId[];
  savedChadhava: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, default: "", trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, default: "" },
    gotra: { type: String, default: "" },
    dob: { type: String, default: "" },
    address: { type: String, default: "" },
    photo: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
    savedTemples: [{ type: Schema.Types.ObjectId, ref: "Temple" }],
    savedChadhava: [{ type: Schema.Types.ObjectId, ref: "Chadhava" }],
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;