import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await requireUser();
  const form = await request.formData();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: String(form.get("name") || user.name),
      phone: String(form.get("phone") || ""),
      ministry: String(form.get("ministry") || ""),
      bio: String(form.get("bio") || "")
    }
  });
  return NextResponse.redirect(new URL("/profile", request.url));
}
