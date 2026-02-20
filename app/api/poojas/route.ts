import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Pooja from "@/models/Pooja";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const templeId = searchParams.get("templeId"); // filter by temple
    const deity    = searchParams.get("deity");    // e.g. "Shiva"
    const featured = searchParams.get("featured"); // "true"
    const search   = searchParams.get("search");   // keyword

    // Build filter
    const filter: Record<string, unknown> = { isActive: true };

    if (templeId) {
      filter.templeId = templeId;
    }
    if (deity && deity !== "All Pujas") {
      filter.deity = deity;
    }
    if (featured === "true") {
      filter.isFeatured = true;
    }
    if (search) {
      filter.$or = [
        { name:        { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { deity:       { $regex: search, $options: "i" } },
      ];
    }

    const poojas = await Pooja.find(filter)
      .populate("templeId", "name location slug") // attach temple name & location
      .sort({ isFeatured: -1, rating: -1 });

    return NextResponse.json({ success: true, data: poojas });
  } catch (error) {
    console.error("GET /api/poojas error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}