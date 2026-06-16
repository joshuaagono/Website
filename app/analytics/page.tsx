import { NavBar } from "@/components/NavBar";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AnalyticsPage() {
  await requireAdmin();
  const sessions = await prisma.analyticsSession.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <>
      <NavBar />
      <main className="page">
        <h1>AI Analytics Center</h1>
        <section className="metrics">
          <article className="card"><strong>{sessions.length}</strong><span>Tracked sessions</span></article>
          <article className="card"><strong>{sessions.reduce((sum, item) => sum + item.totalSecondsSpent, 0)}</strong><span>Total seconds</span></article>
          <article className="card"><strong>{sessions.reduce((sum, item) => sum + item.accessCount, 0)}</strong><span>Access count</span></article>
        </section>
        <section className="matrix">
          <div className="matrix-row head"><span>User</span><span>IP</span><span>Browser</span><span>Provider</span><span>Device</span><span>Location</span><span>Pages</span><span>Time</span><span>Frequency</span></div>
          {sessions.map((session) => (
            <div className="matrix-row" key={session.id}>
              <span>{session.user?.name || "Anonymous"}</span>
              <span>{session.ipAddress || "Backend capture required"}</span>
              <span>{session.browser}</span>
              <span>{session.networkProvider || "Provider lookup required"}</span>
              <span>{session.deviceType}</span>
              <span>{session.location || "Consent not granted"}</span>
              <span>{Array.isArray(session.pagesVisited) ? session.pagesVisited.join(", ") : "Stored JSON"}</span>
              <span>{session.totalSecondsSpent}s</span>
              <span>{session.accessCount}x</span>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
