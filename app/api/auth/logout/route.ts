import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  // Clear the JWT cookie
  response.cookies.set("mandirlok_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}