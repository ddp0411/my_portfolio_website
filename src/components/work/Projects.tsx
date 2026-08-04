import { getPosts } from "@/utils/utils";
import { Grid } from "@once-ui-system/core";
import { ProjectCard } from "@/components";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
  include?: string[];
  columns?: "1" | "2" | "3";
}

export function Projects({ range, exclude, include, columns = "2" }: ProjectsProps) {
  let allProjects = getPosts(["src", "app", "projects", "projects"]);

  // Exclude by slug (exact match)
  if (exclude && exclude.length > 0) {
    allProjects = allProjects.filter((post) => !exclude.includes(post.slug));
  }

  let displayedProjects: typeof allProjects;

  if (include && include.length > 0) {
    // Curated selection: keep only these slugs, in the given order
    displayedProjects = include
      .map((slug) => allProjects.find((post) => post.slug === slug))
      .filter((post): post is (typeof allProjects)[number] => Boolean(post));
  } else {
    const sortedProjects = allProjects.sort((a, b) => {
      return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
    });

    displayedProjects = range
      ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
      : sortedProjects;
  }

  return (
    <Grid columns={columns} s={{ columns: 1 }} fillWidth marginBottom="40" gap="l">
      {displayedProjects.map((post, index) => (
        <ProjectCard
          priority={index < 2}
          key={post.slug}
          href={`/projects/${post.slug}`}
          images={post.metadata.images}
          title={post.metadata.title}
          description={post.metadata.summary}
          content={post.content}
          avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
          link={post.metadata.link || ""}
        />
      ))}
    </Grid>
  );
}
