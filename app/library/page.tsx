import { NavBar } from "@/components/NavBar";
import { prisma } from "@/lib/prisma";

export default async function LibraryPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string }> }) {
  const params = await searchParams;
  const q = params.q?.trim();
  const resources = await prisma.resource.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { serial: { contains: q, mode: "insensitive" } },
            { preacher: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { transcript: { contains: q, mode: "insensitive" } },
            { extractedText: { contains: q, mode: "insensitive" } }
          ]
        }
      : undefined,
    orderBy: { resourceDate: "desc" },
    take: 30
  });

  return (
    <>
      <NavBar />
      <main className="page">
        <h1>Library Search</h1>
        <form className="filters">
          <input name="q" defaultValue={q} placeholder="Search by name, date, serial number, preacher, ID, quote, or keyword..." />
          <select name="type"><option value="">All files</option><option>VIDEO</option><option>AUDIO</option><option>PDF</option><option>EPUB</option><option>PHOTO</option></select>
          <button>Search</button>
        </form>
        <div className="stack">
          {resources.map((resource) => (
            <article className="result" key={resource.id}>
              <strong>{resource.title}</strong>
              <span>{resource.kind} · {resource.serial} · {resource.preacher || "No preacher"} · {resource.resourceDate.toDateString()}</span>
              <p>{resource.extractedText || resource.transcript || resource.description}</p>
            </article>
          ))}
          {resources.length === 0 && <p>No records found.</p>}
        </div>
      </main>
    </>
  );
}
