import { AccessClass, ResourceKind } from "@prisma/client";
import { prisma } from "../lib/prisma";

async function main() {
  const permissions = ["*", "users.approve", "roles.assign", "calendar.edit", "media.publish", "archive.edit", "analytics.view", "payments.view", "site.draft", "site.publish", "plugins.configure"];
  for (const key of permissions) {
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, label: key }
    });
  }

  const superAdminRole = await prisma.role.upsert({
    where: { name: "Super Admin" },
    update: { canDelegate: true },
    create: { name: "Super Admin", description: "Full platform control", canDelegate: true }
  });
  const allPermission = await prisma.permission.findUniqueOrThrow({ where: { key: "*" } });
  await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: allPermission.id } },
    update: {},
    create: { roleId: superAdminRole.id, permissionId: allPermission.id }
  });

  await prisma.user.upsert({
    where: { email: "joshuaagono95@gmail.com" },
    update: { accessClass: AccessClass.SUPER_ADMIN, canAccessAdmin: true },
    create: {
      clerkId: "seed-super-admin",
      email: "joshuaagono95@gmail.com",
      name: "Joshua Agono",
      accessClass: AccessClass.SUPER_ADMIN,
      canAccessAdmin: true,
      ministry: "Super Admin",
      bio: "Platform owner with full system access."
    }
  });

  const bundle = await prisma.archiveBundle.upsert({
    where: { serialBase: "GS-ARC-1001" },
    update: {},
    create: {
      serialBase: "GS-ARC-1001",
      title: "Sunday Service: The Power of Hope",
      category: "services",
      preacher: "Pastor Daniel Reed",
      serviceDate: new Date("2026-06-21"),
      description: "Full worship replay, sermon audio, study notes, and a reader-friendly devotional edition."
    }
  });

  for (const kind of [ResourceKind.VIDEO, ResourceKind.AUDIO, ResourceKind.PDF, ResourceKind.EPUB]) {
    await prisma.resource.upsert({
      where: { serial: `GS-ARC-1001-${kind}` },
      update: {},
      create: {
        serial: `GS-ARC-1001-${kind}`,
        kind,
        title: `Sunday Service: The Power of Hope - ${kind}`,
        preacher: "Pastor Daniel Reed",
        resourceDate: new Date("2026-06-21"),
        description: `${kind} archive file`,
        extractedText: kind === ResourceKind.PDF || kind === ResourceKind.EPUB ? "Hope is confidence that God is present inside the trouble." : null,
        archiveBundleId: bundle.id
      }
    });
  }

  await prisma.pluginIntegration.upsert({
    where: { name: "OpenAI" },
    update: {},
    create: { name: "OpenAI", capability: "AI search, chatbot, sermon summaries", status: "connected" }
  });
}

main().finally(() => prisma.$disconnect());
