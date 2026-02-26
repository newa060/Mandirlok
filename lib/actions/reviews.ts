"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../db";
import Review from "../../models/Review";
import Order from "../../models/Order";
import { Types } from "mongoose";

export async function submitReview(data: {
  userId: string;
  orderId: string;
  poojaId: string;
  templeId: string;
  panditId?: string;
  rating: number;
  comment: string;
}) {
  try {
    await connectDB();

    // Check if order exists and is completed
    const order = await Order.findById(data.orderId);
    if (!order) throw new Error("Order not found");
    if (order.orderStatus !== "completed") {
      throw new Error("Review can only be submitted for completed orders");
    }

    // Check if review already exists for this order
    const existingReview = await Review.findOne({ orderId: data.orderId });
    if (existingReview) throw new Error("Review already exists for this booking");

    const review = await Review.create({
      userId: new Types.ObjectId(data.userId),
      orderId: new Types.ObjectId(data.orderId),
      poojaId: new Types.ObjectId(data.poojaId),
      templeId: new Types.ObjectId(data.templeId),
      panditId: data.panditId ? new Types.ObjectId(data.panditId) : null as any,
      rating: data.rating,
      comment: data.comment,
      isApproved: false,
      isFeatured: false,
    });

    revalidatePath(`/bookings/${data.orderId}`);
    revalidatePath("/dashboard");

    return { success: true, data: JSON.parse(JSON.stringify(review)) };
  } catch (error: any) {
    console.error("[SUBMIT_REVIEW_ERROR]", error);
    return { success: false, error: error.message };
  }
}

export async function getHomepageReviews() {
  try {
    await connectDB();
    // Fetch approved reviews, prioritized featured ones, latest first
    const reviews = await Review.find({ isApproved: true })
      .populate("userId", "name photo")
      .populate("templeId", "name location")
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(6)
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(reviews)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAdminReviews() {
  try {
    await connectDB();
    const reviews = await Review.find()
      .populate("userId", "name email phone")
      .populate("poojaId", "name")
      .populate("templeId", "name")
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(reviews)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateReviewStatus(id: string, updates: { isApproved?: boolean; isFeatured?: boolean }) {
  try {
    await connectDB();
    const review = await Review.findByIdAndUpdate(id, updates, { new: true });

    revalidatePath("/"); // Update homepage
    revalidatePath("/admin/reviews");

    return { success: true, data: JSON.parse(JSON.stringify(review)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteReview(id: string) {
  try {
    await connectDB();
    await Review.findByIdAndDelete(id);
    revalidatePath("/");
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getReviewByOrder(orderId: string) {
  try {
    await connectDB();
    const review = await Review.findOne({ orderId }).lean();
    return review ? JSON.parse(JSON.stringify(review)) : null;
  } catch (error) {
    return null;
  }
}
