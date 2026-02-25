import jwt from "jsonwebtoken";

/**
 * Extract and verify pandit identity from incoming request cookies.
 * Throws an Error with a descriptive message on failure.
 */
export async function getPanditFromRequest(request: Request): Promise<string> {
  const cookieHeader = request.headers.get("cookie") ?? "";

  // Parse the specific cookie value
  const match = cookieHeader.match(/mandirlok_pandit_token=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : null;

  if (!token) {
    throw new Error("Not authenticated");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { panditId: string };
    if (!decoded.panditId) throw new Error("Invalid token payload");
    return decoded.panditId;
  } catch {
    throw new Error("Invalid or expired token");
  }
}
