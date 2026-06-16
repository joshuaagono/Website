import { NavBar } from "@/components/NavBar";
import { prisma } from "@/lib/prisma";

export default async function ArchivePage() {
  const bundles = await prisma.archiveBundle.findMany({
    include: { resources: true },
    orderBy: { serviceDate: "desc" },
    take: 20
  });

  return (
    <>
      <NavBar />
      <main className="page">
        <h1>Archive</h1>
        <form className="filters">
          <input name="q" placeholder="Search archive by title, date, preacher, serial, video, audio, PDF, or EPUB..." />
          <select name="category"><option>All categories</option><option>Services</option><option>Convention</option><option>Training</option></select>
        </form>
        <div className="stack">
          {bundles.map((bundle) => (
            <article className="archive-row" key={bundle.id}>
              <div>
                <strong>{bundle.title}</strong>
                <span>{bundle.serialBase} · {bundle.preacher} · {bundle.serviceDate.toDateString()}</span>
              </div>
              <div className="file-actions">
                {["VIDEO", "AUDIO", "PDF", "EPUB"].map((kind) => <button key={kind}>{kind}</button>)}
              </div>
            </article>
          ))}
          {bundles.length === 0 && <p>No archive bundles yet. Add them from Admin after running Prisma migrations.</p>}
        </div>
      </main>
    </>
  );
}
