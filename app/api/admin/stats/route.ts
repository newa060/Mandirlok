import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Pandit from "@/models/Pandit";
import Temple from "@/models/Temple";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get("mandirlok_token")?.value;
    const decoded = token ? verifyToken(token) : null;
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    await connectDB();

    const [totalOrders, totalUsers, totalPandits, totalTemples, revenueResult, recentOrders, topPoojas] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Pandit.countDocuments({ isActive: true }),
      Temple.countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Order.find({ paymentStatus: "paid" })
        .populate("userId", "name email")
        .populate("poojaId", "name")
        .populate("templeId", "name")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: "$poojaId", count: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: "poojas", localField: "_id", foreignField: "_id", as: "pooja" } },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        totalUsers,
        totalPandits,
        totalTemples,
        totalRevenue: revenueResult[0]?.total || 0,
        recentOrders,
        topPoojas,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
