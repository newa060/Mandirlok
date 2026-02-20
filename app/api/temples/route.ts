import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Temple from "@/models/Temple";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const category  = searchParams.get("category");   // e.g. "Jyotirlinga"
    const state     = searchParams.get("state");       // e.g. "Uttar Pradesh"
    const featured  = searchParams.get("featured");   // "true"
    const popular   = searchParams.get("popular");    // "true"
    const search    = searchParams.get("search");     // search keyword

    // Build filter object
    const filter: Record<string, unknown> = { isActive: true };

    if (category && category !== "All Temples") {
      filter.category = category;
    }
    if (state && state !== "All States") {
      filter.state = state;
    }
    if (featured === "true") {
      filter.isFeatured = true;
    }
    if (popular === "true") {
      filter.isPopular = true;
    }
    if (search) {
      filter.$or = [
        { name:        { $regex: search, $options: "i" } },
        { location:    { $regex: search, $options: "i" } },
        { deity:       { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const temples = await Temple.find(filter).sort({ isFeatured: -1, isPopular: -1, rating: -1 });

    return NextResponse.json({ success: true, data: temples });
  } catch (error) {
    console.error("GET /api/temples error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}