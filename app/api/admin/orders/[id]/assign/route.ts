import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Pandit from "@/models/Pandit";
import { verifyToken } from "@/lib/jwt";
import { sendWhatsApp } from "@/lib/whatsapp";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = cookies().get("mandirlok_token")?.value;
    const decoded = token ? verifyToken(token) : null;
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    await connectDB();
    const { panditId } = await req.json();

    const [order, pandit] = await Promise.all([
      Order.findByIdAndUpdate(params.id, { panditId, orderStatus: "confirmed" }, { new: true })
        .populate("poojaId", "name"),
      Pandit.findById(panditId),
    ]);

    if (!order || !pandit) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    const poojaName = (order.poojaId as any)?.name || "Pooja";

    // Notify devotee
    try {
      await sendWhatsApp(
        order.whatsapp,
        `🙏 *Update on your Mandirlok Booking*\n\nYour *${poojaName}* has been assigned to:\n👤 *Pandit ${pandit.name}*\n📱 ${pandit.phone}\n\n📋 Booking ID: ${order.bookingId}\n📅 Date: ${new Date(order.bookingDate).toLocaleDateString("en-IN")}\n\n*Your pooja will be performed as scheduled. Stay blessed!* 🛕`
      );
    } catch (e) {
      console.error("[WhatsApp pandit assign - devotee]", e);
    }

    // Notify pandit
    try {
      await sendWhatsApp(
        pandit.whatsapp,
        `🛕 *New Pooja Assigned — Mandirlok*\n\n📿 *Pooja:* ${poojaName}\n👤 *Devotee:* ${order.sankalpName}\n📅 *Date:* ${new Date(order.bookingDate).toLocaleDateString("en-IN")}\n📋 *Booking ID:* ${order.bookingId}\n\nPlease log in to your Pandit Portal to view full details.`
      );
    } catch (e) {
      console.error("[WhatsApp pandit assign - pandit]", e);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
