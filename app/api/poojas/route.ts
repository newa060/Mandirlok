import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Pooja from "@/models/Pooja";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const templeId = searchParams.get("templeId");
    const search   = searchParams.get("search");
    const deity    = searchParams.get("deity");
    const limit    = parseInt(searchParams.get("limit") || "50");
    const page     = parseInt(searchParams.get("page")  || "1");

    const query: Record<string, unknown> = { isActive: true };
    if (featured === "true")      query.isFeatured = true;
    if (templeId)                 query.templeId   = templeId;
    if (deity && deity !== "all") query.deity      = deity;
    if (search) {
      query.$or = [
        { name:        { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { deity:       { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [poojas, total] = await Promise.all([
      Pooja.find(query)
        .populate("templeId", "name city slug location")
        .sort({ isFeatured: -1, rating: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Pooja.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: poojas,   // existing pages use: data.success + data.data
      poojas,         // FeaturedPoojas uses: data.poojas
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/poojas error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch poojas" },
      { status: 500 }
    );
  }
}