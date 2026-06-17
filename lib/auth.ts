import { auth, currentUser } from "@clerk/nextjs/server";
import { AccessClass } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getCurrentDbUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  return prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email,
      name: clerkUser.fullName || email
    },
    create: {
      clerkId: clerkUser.id,
      email,
      name: clerkUser.fullName || email,
      accessClass: email.toLowerCase() === "joshuaagono95@gmail.com" ? AccessClass.SUPER_ADMIN : AccessClass.MEMBER,
      canAccessAdmin: email.toLowerCase() === "joshuaagono95@gmail.com"
    }
  });
}

export async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await getCurrentDbUser();
  if (!user) throw new Error("User profile missing");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!user.canAccessAdmin) throw new Error("Admin access required");
  return user;
}
