import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
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

    const isMongoId = mongoose.Types.ObjectId.isValid(id);

    // Find pooja by _id or slug, populate temple details
    const pooja = isMongoId
      ? await Pooja.findById(id).populate("templeId")
      : await Pooja.findOne({ slug: id, isActive: true }).populate("templeId");

    if (!pooja) {
      return NextResponse.json(
        { success: false, message: "Pooja not found" },
        { status: 404 }
      );
    }

    // Also fetch chadhava items for this temple
    const chadhavaItems = await Chadhava.find({
      templeId: pooja.templeId,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      data: {
        pooja,
        chadhavaItems,
      },
    });
  } catch (error) {
    console.error("GET /api/poojas/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}