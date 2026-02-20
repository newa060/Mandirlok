import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Temple from "@/models/Temple";
import Pooja from "@/models/Pooja";
import Chadhava from "@/models/Chadhava";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    // Support both MongoDB _id and slug
    const isMongoId = mongoose.Types.ObjectId.isValid(id);

    const temple = isMongoId
      ? await Temple.findById(id)
      : await Temple.findOne({ slug: id, isActive: true });

    if (!temple) {
      return NextResponse.json(
        { success: false, message: "Temple not found" },
        { status: 404 }
      );
    }

    // Fetch poojas and chadhava for this temple
    const [poojas, chadhavaItems] = await Promise.all([
      Pooja.find({ templeId: temple._id, isActive: true }).sort({ isFeatured: -1, rating: -1 }),
      Chadhava.find({ templeId: temple._id, isActive: true }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        temple,
        poojas,
        chadhavaItems,
      },
    });
  } catch (error) {
    console.error("GET /api/temples/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}