// app/(user)/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Cookie check
  const token = cookies().get("mandirlok_token")?.value;

  if (!token) {
    redirect("/login");
  }

  // 2. JWT verify + DB check (tero existing verify logic jastai)
  try {
    const decoded = jwt.verify(
      token!, 
      process.env.JWT_SECRET!
    ) as { userId: string };

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      redirect("/login");
    }

  } catch {
    // Invalid/expired token
    redirect("/login");
  }

  return <>{children}</>;
}