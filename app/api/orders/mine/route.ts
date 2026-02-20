import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();

    // 1. Auth check
    const token = cookies().get("mandirlok_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // 2. Fetch orders with pooja and temple details
    const orders = await Order.find({ userId: decoded.userId })
      .populate("poojaId",  "name emoji duration")
      .populate("templeId", "name location")
      .populate("panditId", "name phone")
      .sort({ createdAt: -1 }); // newest first

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("GET /api/orders/mine error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}