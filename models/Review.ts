import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IReview extends Document {
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  poojaId: Types.ObjectId;
  templeId: Types.ObjectId;
  panditId?: Types.ObjectId;
  rating: number;
  comment: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
    poojaId: { type: Schema.Types.ObjectId, ref: "Pooja", required: true },
    templeId: { type: Schema.Types.ObjectId, ref: "Temple", required: true },
    panditId: { type: Schema.Types.ObjectId, ref: "Pandit", default: null },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "", maxlength: 500 },
    isApproved: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;