import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IPandit extends Document {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  photo: string;
  assignedTemples: Types.ObjectId[];
  experienceYears: number;
  languages: string[];
  bio: string;
  commissionPercentage: number;
  totalEarnings: number;
  unpaidEarnings: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PanditSchema = new Schema<IPandit>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    email: { type: String, default: "" },
    photo: { type: String, default: "" },
    assignedTemples: [{ type: Schema.Types.ObjectId, ref: "Temple" }],
    experienceYears: { type: Number, default: 0 },
    languages: [{ type: String }],
    bio: { type: String, default: "" },
    commissionPercentage: { type: Number, default: 80 }, // Default 80% to Pandit, 20% to Platform
    totalEarnings: { type: Number, default: 0 },
    unpaidEarnings: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Pandit: Model<IPandit> =
  mongoose.models.Pandit || mongoose.model<IPandit>("Pandit", PanditSchema);

export default Pandit;
