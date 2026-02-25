import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getPanditFromRequest } from "@/lib/panditAuth";

export async function GET(req: Request) {
  try {
    const panditId = await getPanditFromRequest(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    await connectDB();

    const query: any = { panditId };
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate("poojaId", "name emoji duration")
      .populate("templeId", "name location")
      .populate("userId", "name phone whatsapp")
      .sort({ bookingDate: 1 });

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 401 }
    );
  }
}
