import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Pooja from "@/models/Pooja";
import Chadhava from "@/models/Chadhava";
import { sendWhatsApp } from "@/lib/whatsapp";

export async function POST(req: Request) {
  try {
    await connectDB();

    // 1. Get logged in user from JWT cookie
    const token = cookies().get("mandirlok_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      poojaId,
      templeId,
      bookingDate,
      qty = 1,
      chadhavaIds = [],
      sankalpName,
      gotra,
      dob,
      phone,
      whatsapp,
      sankalp,
      address,
    } = body;

    // 2. Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 }
      );
    }

    // 3. Fetch pooja and chadhava details for storing in order
    const pooja = await Pooja.findById(poojaId);
    if (!pooja) {
      return NextResponse.json(
        { success: false, message: "Pooja not found" },
        { status: 404 }
      );
    }

    // Build chadhava items array
    let chadhavaItems: { chadhavaId: string; name: string; price: number; emoji: string }[] = [];
    let chadhavaAmount = 0;

    if (chadhavaIds.length > 0) {
      const chadhavaList = await Chadhava.find({ _id: { $in: chadhavaIds } });
      chadhavaItems = chadhavaList.map((c) => ({
        chadhavaId: c._id.toString(),
        name: c.name,
        price: c.price,
        emoji: c.emoji,
      }));
      chadhavaAmount = chadhavaList.reduce((sum, c) => sum + c.price, 0);
    }

    const poojaAmount = pooja.price * qty;
    const totalAmount = poojaAmount + chadhavaAmount;

    // 4. Save order to DB
    const order = await Order.create({
      userId: decoded.userId,
      poojaId,
      templeId,
      bookingDate: new Date(bookingDate),
      sankalpName,
      gotra: gotra || "",
      dob: dob || "",
      phone,
      whatsapp,
      sankalp: sankalp || "",
      address: address || "",
      qty: Number(qty),
      chadhavaItems,
      poojaAmount,
      chadhavaAmount,
      totalAmount,
      paymentStatus: "paid",
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderStatus: "pending",
    });

    // 5. Send WhatsApp confirmation
    try {
      await sendWhatsApp(
        whatsapp,
        `🙏 *Jai Shri Ram!*\n\nYour booking is confirmed on *Mandirlok*.\n\n📋 *Booking ID:* ${order.bookingId}\n📿 *Pooja:* ${pooja.name}\n📅 *Date:* ${new Date(bookingDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}\n💰 *Amount Paid:* ₹${totalAmount}\n\nA pandit will be assigned shortly. You will receive another WhatsApp update.\n\n🛕 *Mandirlok — Divine Blessings Delivered*`
      );
    } catch (e) {
      console.error("[WhatsApp booking confirmation failed]", e);
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and order created",
      data: {
        orderId: order._id,
        bookingId: order.bookingId,
      },
    });
  } catch (error: any) {
    console.error("POST /api/payment/verify error:");
    if (error.errors) {
      console.error(Object.keys(error.errors).map(k => `${k}: ${error.errors[k].message}`).join('\n'));
    } else {
      console.error(error);
    }
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}