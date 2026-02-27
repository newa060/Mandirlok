import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getPanditFromRequest } from "@/lib/panditAuth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const panditId = await getPanditFromRequest(req);
        if (!panditId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const order = await Order.findOneAndUpdate(
            { _id: params.id, panditId },
            { panditId: null, orderStatus: "pending" },
            { new: true }
        );

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found or not assigned to you" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
