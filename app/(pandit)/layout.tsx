// app/(pandit)/layout.tsx — Server-side auth guard for pandit routes
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Pandit from "@/models/Pandit";

export default async function PanditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("mandirlok_pandit_token")?.value;

  if (!token) {
    redirect("/pandit-login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { panditId: string };

    await connectDB();
    const pandit = await Pandit.findById(decoded.panditId);

    if (!pandit || !pandit.isActive) {
      redirect("/pandit-login");
    }
  } catch {
    redirect("/pandit-login");
  }

  return <>{children}</>;
}
