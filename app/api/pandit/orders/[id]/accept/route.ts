import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Notification from "@/models/Notification";
import { getPanditFromRequest } from "@/lib/panditAuth";
import { sendWhatsApp } from "@/lib/whatsapp";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const panditId = await getPanditFromRequest(req);
        if (!panditId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const order = await Order.findOneAndUpdate(
            { _id: params.id, panditId },
            { orderStatus: "confirmed" },
            { new: true }
        ).populate("poojaId", "name");

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found or not assigned to you" }, { status: 404 });
        }

        // Notify devotee
        try {
            const poojaName = (order.poojaId as any)?.name || "Pooja";
            await sendWhatsApp(
                order.whatsapp,
                `🙏 *Jai Shri Ram!*\n\n*Update:* Your pooja booking has been confirmed by the Pandit.\n\n📿 *Pooja:* ${poojaName}\n📋 *Booking ID:* ${order.bookingId}\n\nStay blessed! 🛕`
            );
        } catch (e) {
            console.error("[WhatsApp acceptOrder API notification failed]", e);
        }

        // Create In-app Notification
        try {
            await Notification.create({
                userId: order.userId,
                title: "Booking Accepted! 🧘",
                message: `Your booking for ${(order.poojaId as any)?.name || "Pooja"} has been accepted by the Pandit.`,
                type: "booking",
                link: `/bookings/${order._id}`
            });
        } catch (notifError) {
            console.error("Failed to create in-app notification (pandit accept):", notifError);
        }

        return NextResponse.json({ success: true, data: order });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
