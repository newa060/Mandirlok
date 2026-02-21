import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        // Authenticate via JWT cookie
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

        const order = await Order.findById(params.id);

        if (!order) {
            return NextResponse.json(
                { success: false, message: "Booking not found" },
                { status: 404 }
            );
        }

        if (order.userId.toString() !== decoded.userId) {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            );
        }

        if (order.orderStatus === "completed" || order.orderStatus === "cancelled" || order.orderStatus === "in-progress") {
            return NextResponse.json(
                { success: false, message: "This booking cannot be cancelled." },
                { status: 400 }
            );
        }

        order.orderStatus = "cancelled";
        await order.save();

        return NextResponse.json({
            success: true,
            message: "Booking cancelled successfully.",
            data: order,
        });
    } catch (error: any) {
        console.error("POST /api/orders/[id]/cancel error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
