import { getPosts } from "@/utils/utils";
import { about, baseURL, person, social } from "@/resources";
import { knowsAbout, place } from "@/components/seo";

// Served at /llms.txt (https://llmstxt.org): a plain-text map of the site for AI
// engines. Built from the same content as the pages, so it stays current.
export const dynamic = "force-static";

const byNewest = <T extends { metadata: { publishedAt: string } }>(items: T[]) =>
  [...items].sort((a, b) => b.metadata.publishedAt.localeCompare(a.metadata.publishedAt));

export function GET() {
  const posts = byNewest(getPosts(["src", "app", "blog", "posts"]));
  const projects = byNewest(getPosts(["src", "app", "projects", "projects"]));
  const current = about.work.experiences[0];
  const profiles = social.filter((s) => s.link?.startsWith("http"));

  const lines = [
    `# ${person.name}`,
    "",
    `> ${person.name} (${person.firstName} ${person.lastName}) is a ${person.role} based in ${place.label}${
      current ? `, currently at ${current.company.replace(/\.$/, "")}` : ""
    }. ${person.firstName} builds data pipelines, retrieval-augmented generation (RAG) systems and computer-vision applications, and writes up the lessons from each.`,
    "",
    `- Current role: ${current ? `${current.role}, ${current.company} (${current.timeframe})` : person.role}`,
    `- Education: ${about.studies.institutions
      .slice(0, 2)
      .map((i) => i.name)
      .join("; ")}`,
    `- Focus areas: ${knowsAbout.join(", ")}`,
    `- Languages: ${person.languages?.join(", ")}`,
    "",
    "## Profile",
    "",
    `- [About](${baseURL}/about): background, work experience, education and technical skills`,
    `- [Work experience](${baseURL}/work): roles and responsibilities, newest first`,
    `- [Publications](${baseURL}/publications): peer-reviewed papers on real-time vehicle overspeed detection`,
    `- [Resume (PDF)](${baseURL}/devanshu-patil-resume.pdf)`,
    "",
    "## Projects",
    "",
    ...projects.map(
      (p) => `- [${p.metadata.title}](${baseURL}/projects/${p.slug}): ${p.metadata.summary}`,
    ),
    "",
    "## Blog",
    "",
    ...posts.map((p) => `- [${p.metadata.title}](${baseURL}/blog/${p.slug}): ${p.metadata.summary}`),
    "",
    "## Contact",
    "",
    ...profiles.map((s) => `- [${s.name}](${s.link})`),
    "",
    "## Optional",
    "",
    `- [Sitemap](${baseURL}/sitemap.xml)`,
    `- [RSS feed](${baseURL}/api/rss)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
