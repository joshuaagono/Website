import { NavBar } from "@/components/NavBar";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  await requireAdmin();
  const [users, roles, plugins, sections] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.role.findMany({ include: { permissions: { include: { permission: true } } } }),
    prisma.pluginIntegration.findMany(),
    prisma.siteSection.findMany()
  ]);

  return (
    <>
      <NavBar />
      <main className="page">
        <h1>Admin Portal</h1>
        <section className="grid two">
          <article className="panel">
            <h2>Users and Access</h2>
            <div className="stack">{users.map((user) => <p key={user.id}><strong>{user.name}</strong> · {user.accessClass} · Admin: {user.canAccessAdmin ? "Granted" : "No"}</p>)}</div>
          </article>
          <article className="panel">
            <h2>Role Classes</h2>
            <div className="stack">{roles.map((role) => <p key={role.id}><strong>{role.name}</strong> · {role.permissions.map((item) => item.permission.key).join(", ") || "No permissions"}</p>)}</div>
          </article>
        </section>
        <section className="grid two">
          <article className="panel">
            <h2>APIs and Plugins</h2>
            <div className="cards">{plugins.map((plugin) => <div className="card" key={plugin.id}><strong>{plugin.name}</strong><span>{plugin.capability}</span><em>{plugin.status}</em></div>)}</div>
          </article>
          <article className="panel">
            <h2>Website Editor Sections</h2>
            <div className="stack">{sections.map((section) => <p key={section.id}><strong>{section.title}</strong> · {section.status}</p>)}</div>
          </article>
        </section>
      </main>
    </>
  );
}
