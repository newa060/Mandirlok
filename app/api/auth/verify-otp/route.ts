import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { generateToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 1️⃣ Find OTP
    const existingOtp = await Otp.findOne({ email });

    if (!existingOtp) {
      return NextResponse.json(
        { success: false, message: "OTP not found" },
        { status: 400 }
      );
    }

    // 2️⃣ Check expiration
    if (existingOtp.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      return NextResponse.json(
        { success: false, message: "OTP expired" },
        { status: 400 }
      );
    }

    // 3️⃣ Check OTP match
    if (existingOtp.otp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // 4️⃣ OTP correct → delete it
    await Otp.deleteMany({ email });

    // 5️⃣ Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        lastLogin: new Date(),
      });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    // 6️⃣ Generate JWT
    const token = generateToken(user._id.toString());

    // 7️⃣ Set cookie
    cookies().set("mandirlok_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    // 8️⃣ Check if user has name (FIX: added this check)
    const hasName = typeof user.name === "string" && user.name.trim().length > 0;

    return NextResponse.json({
      success: true,
      message: "Login successful",
      hasName, // This tells frontend whether to show name input step
    });
  } catch (error) {
    console.error("verify-otp error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}