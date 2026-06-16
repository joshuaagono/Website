import { NavBar } from "@/components/NavBar";
import { LivePlayer } from "@/components/LivePlayer";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">Next.js + TypeScript + PostgreSQL + Prisma + Clerk + Vercel</p>
            <h1>GraceStream Church Platform</h1>
            <p>A scalable church website for live worship, archive bundles, AI-powered search, donations, user profiles, admin permissions, analytics, and direct website editing.</p>
          </div>
          <aside className="hero-card">
            <strong>RBAC</strong><span>Super Admin controls feature access</span>
            <strong>30m</strong><span>Automatic inactivity logout via Clerk/session policy</span>
            <strong>4-in-1</strong><span>Video, audio, PDF, and EPUB archive bundles</span>
          </aside>
        </section>
        <section className="grid two">
          <LivePlayer />
          <article className="panel">
            <h2>Platform Modules</h2>
            <div className="stack">
              <p>Archive search indexes bundled video, audio, PDF, and EPUB files.</p>
              <p>Library search can match title, date, serial number, preacher, ID, transcripts, and document text.</p>
              <p>Admin and Analytics are hidden unless Super Admin grants access.</p>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
