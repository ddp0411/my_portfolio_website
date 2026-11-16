import type { MetadataRoute } from "next";
import { getPosts } from "@/utils/utils";
import { baseURL, routes as routesConfig } from "@/resources";

// Served at /sitemap.xml. Rebuilt on every deploy, so new posts and projects
// appear automatically — there is no static sitemap file to maintain.

const absolute = (src: string) => (src.startsWith("http") ? src : `${baseURL}${src}`);
const newest = (dates: string[]) => dates.filter(Boolean).sort().at(-1);

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts(["src", "app", "blog", "posts"]);
  const projects = getPosts(["src", "app", "projects", "projects"]);

  const blogs: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseURL}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
    changeFrequency: "yearly",
    priority: 0.7,
    ...(post.metadata.image && { images: [absolute(post.metadata.image)] }),
  }));

  const works: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseURL}/projects/${project.slug}`,
    lastModified: project.metadata.publishedAt,
    changeFrequency: "yearly",
    priority: 0.7,
    ...(project.metadata.images.length > 0 && {
      images: project.metadata.images.map(absolute),
    }),
  }));

  const latestPost = newest(posts.map((p) => p.metadata.publishedAt));
  const latestProject = newest(projects.map((p) => p.metadata.publishedAt));
  const latestAny = newest([latestPost ?? "", latestProject ?? ""]);

  // Section pages report the date of their newest item instead of the build
  // date, so lastmod only changes when something actually changed.
  const sectionDates: Record<string, string | undefined> = {
    "/blog": latestPost,
    "/projects": latestProject,
    "/": latestAny,
  };

  const priorities: Record<string, number> = { "/": 1, "/about": 0.9, "/projects": 0.8, "/blog": 0.8 };

  const pages: MetadataRoute.Sitemap = Object.keys(routesConfig)
    .filter((route) => routesConfig[route as keyof typeof routesConfig])
    .map((route) => ({
      url: `${baseURL}${route !== "/" ? route : ""}`,
      ...(sectionDates[route] && { lastModified: sectionDates[route] }),
      changeFrequency: "monthly",
      priority: priorities[route] ?? 0.6,
    }));

  return [...pages, ...works, ...blogs];
}
