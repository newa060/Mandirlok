import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getPanditFromRequest } from "@/lib/panditAuth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const panditId = await getPanditFromRequest(req);
    await connectDB();

    const order = await Order.findById(params.id)
      .populate("poojaId")
      .populate("templeId")
      .populate("userId", "name phone whatsapp");

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.panditId?.toString() !== panditId) {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 401 }
    );
  }
}
