import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Pandit from "@/models/Pandit";
import { getPanditFromRequest } from "@/lib/panditAuth";

export async function GET(req: Request) {
  try {
    const panditId = await getPanditFromRequest(req);
    await connectDB();

    const pandit = await Pandit.findById(panditId)
      .populate("assignedTemples", "name");

    if (!pandit) {
      return NextResponse.json(
        { success: false, message: "Pandit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: pandit });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 401 }
    );
  }
}
