import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IChadhava extends Document {
  name: string;
  templeId: Types.ObjectId;
  emoji: string;
  price: number;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChadhavaSchema = new Schema<IChadhava>(
  {
    name: { type: String, required: true, trim: true },
    templeId: { type: Schema.Types.ObjectId, ref: "Temple", required: true },
    emoji: { type: String, default: "🌸" },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Chadhava: Model<IChadhava> =
  mongoose.models.Chadhava || mongoose.model<IChadhava>("Chadhava", ChadhavaSchema);

export default Chadhava;